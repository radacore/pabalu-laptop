<?php

namespace App\Services;

use App\Models\ServiceCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

/**
 * @extends BaseService<ServiceCategory>
 */
class ServiceCategoryService extends BaseService
{
    /**
     * Get the model class name.
     *
     * @return class-string<ServiceCategory>
     */
    protected function model(): string
    {
        return ServiceCategory::class;
    }

    /**
     * Get all service categories with pagination.
     */
    public function getAllServiceCategories(): LengthAwarePaginator
    {
        $query = ServiceCategory::query();

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
