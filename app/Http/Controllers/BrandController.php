<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use App\Models\Brand;
use App\Services\BrandService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(
        protected BrandService $brandService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $brands = $this->brandService->getAllBrands();

        return Inertia::render('brand/BrandIndexPage', [
            'brands' => $brands,
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
        return Inertia::render('brand/BrandCreatePage');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBrandRequest $request): RedirectResponse
    {
        $this->brandService->store($request->validated());

        return redirect()->route('brands.index')
            ->with('success', 'Brand created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Brand $brand): Response
    {
        return Inertia::render('brand/BrandEditPage', [
            'brand' => $brand,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBrandRequest $request, Brand $brand): RedirectResponse
    {
        $this->brandService->update($brand, $request->validated());

        return redirect()->route('brands.index')
            ->with('success', 'Brand updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand): RedirectResponse
    {
        try {
            $this->brandService->destroy($brand);

            return redirect()->route('brands.index')
                ->with('success', 'Brand deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('brands.index')
                ->with('error', $e->getMessage());
        }
    }
}
