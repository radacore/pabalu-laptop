<?php

namespace App\Services;

use App\Helpers\ImageHelper;
use App\Models\Laptop;
use App\Models\LaptopPhoto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * @extends BaseService<Laptop>
 */
class LaptopService extends BaseService
{
    private const SPEC_FIELDS = [
        'processor',
        'ram',
        'storage',
        'gpu',
        'display',
        'battery',
        'os',
        'color',
        'year',
    ];

    /**
     * Get the model class name.
     *
     * @return class-string<Laptop>
     */
    protected function model(): string
    {
        return Laptop::class;
    }

    /**
     * Store a laptop with its specs and photos.
     */
    public function store(array $data): Model
    {
        return DB::transaction(function () use ($data): Model {
            $this->beforeStore($data);

            $specData = $this->extractSpecData($data);
            $photos = $this->extractUploadedPhotos($data);

            /** @var Laptop $laptop */
            $laptop = Laptop::create($data);

            $this->afterStore($laptop, $data);

            if ($this->hasFilledValue($specData)) {
                $laptop->specs()->create($specData);
            }

            foreach ($photos as $i => $path) {
                $laptop->photos()->create([
                    'photo_path' => $path,
                    'is_primary' => $i === 0,
                ]);
            }

            return $laptop->load(['brand', 'laptopSource', 'specs', 'photos']);
        });
    }

    /**
     * Update a laptop with upserted specs and photos.
     *
     * @param  Laptop  $model
     */
    public function update(Model $model, array $data): Model
    {
        return DB::transaction(function () use ($model, $data): Model {
            $this->beforeUpdate($model, $data);

            $specData = $this->extractSpecData($data);
            $newPhotos = $this->extractUploadedPhotos($data);
            $deletedPhotoIds = $this->extractDeletedPhotoIds($data);

            $model->update($data);

            $this->afterUpdate($model, $data);

            if ($model->specs()->exists() || $this->hasFilledValue($specData)) {
                $model->specs()->updateOrCreate(
                    ['laptop_id' => $model->id],
                    $specData
                );
            }

            foreach ($deletedPhotoIds as $id) {
                $photo = LaptopPhoto::find($id);
                if ($photo) {
                    Storage::disk('public')->delete($photo->photo_path);
                    $photo->delete();
                }
            }

            foreach ($newPhotos as $path) {
                $model->photos()->create([
                    'photo_path' => $path,
                    'is_primary' => false,
                ]);
            }

            return $model->load(['brand', 'laptopSource', 'specs', 'photos']);
        });
    }

    /**
     * Hook: Before deleting - remove related specs, photos, and files.
     *
     * @param  Laptop  $laptop
     */
    protected function beforeDestroy(Model $laptop): void
    {
        $laptop->specs()->delete();

        foreach ($laptop->photos as $photo) {
            Storage::disk('public')->delete($photo->photo_path);
        }

        $laptop->photos()->delete();
    }

    /**
     * Get all laptops with pagination.
     */
    public function getAllLaptops(): LengthAwarePaginator
    {
        $query = Laptop::query()->with(['brand', 'laptopSource']);

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('model_name', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%");
            });
        }

        if ($brandId = request('brand_id')) {
            $query->where('brand_id', $brandId);
        }

        return QueryBuilder::for($query)
            ->allowedFilters([
                AllowedFilter::partial('model_name'),
                AllowedFilter::partial('serial_number'),
                AllowedFilter::exact('brand_id'),
            ])
            ->allowedSorts(['model_name', 'serial_number', 'condition', 'status', 'purchase_price', 'selling_price', 'created_at'])
            ->defaultSort('-created_at')
            ->paginate(10)
            ->withQueryString();
    }

    /**
     * Prepare laptop for editing.
     */
    public function getLaptopForEdit(Laptop $laptop): Laptop
    {
        $laptop->load(['brand', 'laptopSource', 'specs', 'photos']);

        return $laptop;
    }

    private function extractSpecData(array &$data): array
    {
        $specData = [];

        foreach (self::SPEC_FIELDS as $field) {
            if (array_key_exists($field, $data)) {
                $specData[$field] = $data[$field];
                unset($data[$field]);
            }
        }

        return $specData;
    }

    private function extractUploadedPhotos(array &$data): array
    {
        $files = $data['photos'] ?? [];
        unset($data['photos']);

        $paths = [];

        if (is_array($files)) {
            foreach ($files as $file) {
                if ($file instanceof UploadedFile && $file->isValid()) {
                    $paths[] = ImageHelper::compressToWebp($file);
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

    private function hasFilledValue(array $data): bool
    {
        return collect($data)->contains(fn ($value) => filled($value));
    }
}
