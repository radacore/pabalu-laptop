<?php

namespace App\Services;

use App\Helpers\ImageHelper;
use App\Models\Service;
use App\Models\ServicePhoto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * @extends BaseService<Service>
 */
class ServiceService extends BaseService
{
    public const STATUSES = [
        'received',
        'diagnosed',
        'in_progress',
        'waiting_parts',
        'waiting_approval',
        'repaired',
        'pickup_ready',
        'completed',
        'cancelled',
    ];

    /**
     * Get the model class name.
     *
     * @return class-string<Service>
     */
    protected function model(): string
    {
        return Service::class;
    }

    /**
     * Get all services with pagination.
     */
    public function getAllServices(): LengthAwarePaginator
    {
        $query = Service::query()->with(['customer', 'laptop', 'serviceCategory']);

        if ($search = request('search')) {
            $query->where(function ($query) use ($search) {
                $query->where('tracking_code', 'like', "%{$search}%")
                    ->orWhere('laptop_model', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%")
                    ->orWhereHas('customer', function ($customerQuery) use ($search) {
                        $customerQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
                    });
            });
        }

        if ($status = request('status')) {
            $query->where('status', $status);
        }

        return QueryBuilder::for($query)
            ->allowedFilters([
                AllowedFilter::partial('tracking_code'),
                AllowedFilter::partial('laptop_model'),
                AllowedFilter::exact('status'),
                AllowedFilter::exact('customer_id'),
                AllowedFilter::exact('service_category_id'),
            ])
            ->allowedSorts(['tracking_code', 'laptop_model', 'status', 'estimated_cost', 'created_at', 'customer_id', 'service_category_id'])
            ->defaultSort('-created_at')
            ->paginate(10)
            ->withQueryString();
    }

    /**
     * Generate a unique service tracking code.
     */
    public function generateTrackingCode(): string
    {
        do {
            $code = 'SRV-'.now()->format('Ymd').'-'.strtoupper(bin2hex(random_bytes(2)));
        } while (Service::where('tracking_code', $code)->exists());

        return $code;
    }

    /**
     * Store a service with its initial update, parts, and photos.
     */
    public function store(array $data): Model
    {
        return DB::transaction(function () use ($data): Model {
            $this->beforeStore($data);

            $partsData = $this->extractPartsData($data);
            $photos = $this->extractUploadedPhotos($data);
            $data['tracking_code'] = $this->generateTrackingCode();
            $data['status'] = 'received';

            /** @var Service $service */
            $service = Service::create($data);

            $this->afterStore($service, $data);

            $service->updates()->create([
                'user_id' => Auth::id(),
                'content' => 'Service created',
                'old_status' => null,
                'new_status' => $service->status,
                'is_customer_visible' => true,
            ]);

            if ($partsData !== []) {
                $service->parts()->createMany($partsData);
            }

            foreach ($photos as $path) {
                $service->photos()->create(['photo_path' => $path]);
            }

            return $service->load(['customer', 'laptop', 'serviceCategory', 'updates', 'parts', 'photos']);
        });
    }

    /**
     * Update a service with status log, synced parts, and photos.
     *
     * @param  Service  $model
     */
    public function update(Model $model, array $data): Model
    {
        return DB::transaction(function () use ($model, $data): Model {
            $this->beforeUpdate($model, $data);

            $partsData = $this->extractPartsData($data);
            $newPhotos = $this->extractUploadedPhotos($data);
            $deletedPhotoIds = $this->extractDeletedPhotoIds($data);
            $oldStatus = $model->status;

            $model->update($data);

            $this->afterUpdate($model, $data);

            if (array_key_exists('status', $data) && $oldStatus !== $model->status) {
                $this->createStatusUpdate($model, $oldStatus, $model->status);
            }

            $model->parts()->delete();
            if ($partsData !== []) {
                $model->parts()->createMany($partsData);
            }

            foreach ($deletedPhotoIds as $id) {
                $photo = ServicePhoto::find($id);
                if ($photo) {
                    Storage::disk('public')->delete($photo->photo_path);
                    $photo->delete();
                }
            }

            foreach ($newPhotos as $path) {
                $model->photos()->create(['photo_path' => $path]);
            }

            return $model->load(['customer', 'laptop', 'serviceCategory', 'updates', 'parts', 'photos']);
        });
    }

    /**
     * Update service status and create a customer-visible update.
     */
    public function updateStatus(Service $service, string $status): Service
    {
        return DB::transaction(function () use ($service, $status): Service {
            if ($service->status === $status) {
                return $service;
            }

            $oldStatus = $service->status;
            $service->update(['status' => $status]);
            $this->createStatusUpdate($service, $oldStatus, $status);

            return $service->load(['customer', 'laptop', 'serviceCategory', 'updates', 'parts', 'photos']);
        });
    }

    /**
     * Hook: Before deleting - remove related files and records.
     *
     * @param  Service  $service
     */
    protected function beforeDestroy(Model $service): void
    {
        $service->updates()->delete();
        $service->parts()->delete();

        foreach ($service->photos as $photo) {
            Storage::disk('public')->delete($photo->photo_path);
        }

        $service->photos()->delete();
    }

    /**
     * Get one service ready for editing.
     */
    public function getServiceForEdit(Service $service): Service
    {
        return $service->load([
            'customer',
            'laptop',
            'serviceCategory',
            'updates' => fn ($query) => $query->latest(),
            'parts',
            'photos',
        ]);
    }

    /**
     * Get status options for filters and forms.
     *
     * @return array<int, array{value: string, label: string}>
     */
    public static function statusOptions(): array
    {
        return array_map(
            fn (string $status): array => ['value' => $status, 'label' => str($status)->replace('_', ' ')->title()->toString()],
            self::STATUSES
        );
    }

    /**
     * @return array<int, array{part_name: string, quantity: int, unit_price: mixed}>
     */
    private function extractPartsData(array &$data): array
    {
        $parts = $data['parts'] ?? [];
        unset($data['parts']);

        return collect($parts)
            ->filter(fn (array $part): bool => filled($part['part_name'] ?? null))
            ->map(fn (array $part): array => [
                'part_name' => $part['part_name'],
                'quantity' => (int) $part['quantity'],
                'unit_price' => $part['unit_price'],
            ])
            ->values()
            ->all();
    }

    private function createStatusUpdate(Service $service, ?string $oldStatus, string $newStatus): void
    {
        $service->updates()->create([
            'user_id' => Auth::id(),
            'content' => "Status changed from {$oldStatus} to {$newStatus}",
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'is_customer_visible' => true,
        ]);
    }

    private function extractUploadedPhotos(array &$data): array
    {
        $files = $data['photos'] ?? [];
        unset($data['photos']);

        $paths = [];

        if (is_array($files)) {
            foreach ($files as $file) {
                if ($file instanceof UploadedFile && $file->isValid()) {
                    $paths[] = ImageHelper::compressToWebp($file, 'service-photos');
                }
            }
        }

        return $paths;
    }

    private function extractDeletedPhotoIds(array &$data): array
    {
        $ids = $data['deleted_photos'] ?? [];
        unset($data['deleted_photos']);

        return array_map('intval', (array) $ids);
    }
}
