<?php

namespace App\Services;

use App\Models\Laptop;
use App\Models\LaptopSource;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * @extends BaseService<LaptopSource>
 */
class LaptopSourceService extends BaseService
{
    /**
     * Get the model class name.
     *
     * @return class-string<LaptopSource>
     */
    protected function model(): string
    {
        return LaptopSource::class;
    }

    /**
     * Hook: Before deleting - prevent deleting sources used by laptops.
     *
     * @param  LaptopSource  $laptopSource
     *
     * @throws \Exception
     */
    protected function beforeDestroy(Model $laptopSource): void
    {
        if (Laptop::withTrashed()->where('laptop_source_id', $laptopSource->id)->exists()) {
            throw new \Exception('Cannot delete a laptop source that is assigned to laptops.');
        }
    }

    /**
     * Get all laptop sources with pagination.
     */
    public function getAllLaptopSources(): LengthAwarePaginator
    {
        $query = LaptopSource::query();

        if ($search = request('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        return QueryBuilder::for($query)
            ->allowedFilters([
                AllowedFilter::partial('name'),
            ])
            ->allowedSorts(['name', 'created_at'])
            ->defaultSort('-created_at')
            ->paginate(10)
            ->withQueryString();
    }
}
