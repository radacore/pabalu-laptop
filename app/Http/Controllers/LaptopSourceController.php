<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLaptopSourceRequest;
use App\Http\Requests\UpdateLaptopSourceRequest;
use App\Models\LaptopSource;
use App\Services\LaptopSourceService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LaptopSourceController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(
        protected LaptopSourceService $laptopSourceService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $laptopSources = $this->laptopSourceService->getAllLaptopSources();

        return Inertia::render('laptop-source/LaptopSourceIndexPage', [
            'laptopSources' => $laptopSources,
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
        return Inertia::render('laptop-source/LaptopSourceCreatePage');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreLaptopSourceRequest $request): RedirectResponse
    {
        $this->laptopSourceService->store($request->validated());

        return redirect()->route('laptop-sources.index')
            ->with('success', __('flash.created', ['entity' => 'Laptop source']));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LaptopSource $laptopSource): Response
    {
        return Inertia::render('laptop-source/LaptopSourceEditPage', [
            'laptopSource' => $laptopSource,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateLaptopSourceRequest $request, LaptopSource $laptopSource): RedirectResponse
    {
        $this->laptopSourceService->update($laptopSource, $request->validated());

        return redirect()->route('laptop-sources.index')
            ->with('success', __('flash.updated', ['entity' => 'Laptop source']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LaptopSource $laptopSource): RedirectResponse
    {
        try {
            $this->laptopSourceService->destroy($laptopSource);

            return redirect()->route('laptop-sources.index')
                ->with('success', __('flash.deleted', ['entity' => 'Laptop source']));
        } catch (\Exception $e) {
            return redirect()->route('laptop-sources.index')
                ->with('error', $e->getMessage());
        }
    }
}
