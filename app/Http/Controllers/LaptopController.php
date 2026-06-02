<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLaptopRequest;
use App\Http\Requests\UpdateLaptopRequest;
use App\Models\Brand;
use App\Models\Laptop;
use App\Models\LaptopSource;
use App\Services\LaptopService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LaptopController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(
        protected LaptopService $laptopService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $laptops = $this->laptopService->getAllLaptops();

        return Inertia::render('laptop/LaptopIndexPage', [
            'laptops' => $laptops,
            'brands' => $this->getBrands(),
            'state' => [
                'search' => request('search'),
                'sort' => request('sort'),
                'brand_id' => request('brand_id'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('laptop/LaptopCreatePage', [
            'brands' => $this->getBrands(),
            'laptopSources' => $this->getLaptopSources(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLaptopRequest $request): RedirectResponse
    {
        $this->laptopService->store($request->validated());

        return redirect()->route('laptops.index')
            ->with('success', __('flash.created', ['entity' => 'Laptop']));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Laptop $laptop): Response
    {
        return Inertia::render('laptop/LaptopEditPage', [
            'laptop' => $this->laptopService->getLaptopForEdit($laptop),
            'brands' => $this->getBrands(),
            'laptopSources' => $this->getLaptopSources(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLaptopRequest $request, Laptop $laptop): RedirectResponse
    {
        $this->laptopService->update($laptop, $request->validated());

        return redirect()->route('laptops.index')
            ->with('success', __('flash.updated', ['entity' => 'Laptop']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Laptop $laptop): RedirectResponse
    {
        try {
            $this->laptopService->destroy($laptop);

            return redirect()->route('laptops.index')
                ->with('success', __('flash.deleted', ['entity' => 'Laptop']));
        } catch (\Exception $e) {
            return redirect()->route('laptops.index')
                ->with('error', $e->getMessage());
        }
    }

    private function getBrands()
    {
        return Brand::query()
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get();
    }

    private function getLaptopSources()
    {
        return LaptopSource::query()
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get();
    }
}
