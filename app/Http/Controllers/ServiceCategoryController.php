<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceCategoryRequest;
use App\Http\Requests\UpdateServiceCategoryRequest;
use App\Models\ServiceCategory;
use App\Services\ServiceCategoryService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ServiceCategoryController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(
        protected ServiceCategoryService $serviceCategoryService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $serviceCategories = $this->serviceCategoryService->getAllServiceCategories();

        return Inertia::render('service-category/ServiceCategoryIndexPage', [
            'serviceCategories' => $serviceCategories,
            'state' => [
                'search' => request('search'),
                'sort' => request('sort'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('service-category/ServiceCategoryCreatePage');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreServiceCategoryRequest $request): RedirectResponse
    {
        $this->serviceCategoryService->store($request->validated());

        return redirect()->route('service-categories.index')
            ->with('success', __('flash.created', ['entity' => 'Service category']));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ServiceCategory $serviceCategory): Response
    {
        return Inertia::render('service-category/ServiceCategoryEditPage', [
            'serviceCategory' => $serviceCategory,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateServiceCategoryRequest $request, ServiceCategory $serviceCategory): RedirectResponse
    {
        $this->serviceCategoryService->update($serviceCategory, $request->validated());

        return redirect()->route('service-categories.index')
            ->with('success', __('flash.updated', ['entity' => 'Service category']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ServiceCategory $serviceCategory): RedirectResponse
    {
        try {
            $this->serviceCategoryService->destroy($serviceCategory);

            return redirect()->route('service-categories.index')
                ->with('success', __('flash.deleted', ['entity' => 'Service category']));
        } catch (\Exception $e) {
            return redirect()->route('service-categories.index')
                ->with('error', $e->getMessage());
        }
    }
}
