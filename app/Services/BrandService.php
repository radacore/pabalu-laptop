<?php

namespace App\Services;

use App\Models\Brand;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * @extends BaseService<Brand>
 */
class BrandService extends BaseService
{
    /**
     * Get the model class name.
     *
     * @return class-string<Brand>
     */
    protected function model(): string
    {
        return Brand::class;
    }

    /**
     * Get all brands with pagination.
     */
    public function getAllBrands(): LengthAwarePaginator
    {
        $query = Brand::query();

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
