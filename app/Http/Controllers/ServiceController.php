<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Models\Customer;
use App\Models\Laptop;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Services\ServiceService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(
        protected ServiceService $serviceService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $services = $this->serviceService->getAllServices();

        return Inertia::render('service/ServiceIndexPage', [
            'services' => $services,
            'statuses' => ServiceService::statusOptions(),
            'state' => [
                'search' => request('search'),
                'sort' => request('sort'),
                'status' => request('status'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('service/ServiceCreatePage', [
            'customers' => $this->getCustomers(),
            'laptops' => $this->getLaptops(),
            'serviceCategories' => $this->getServiceCategories(),
            'statuses' => ServiceService::statusOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreServiceRequest $request): RedirectResponse
    {
        $this->serviceService->store($request->validated());

        return redirect()->route('services.index')
            ->with('success', 'Service created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service): Response
    {
        return Inertia::render('service/ServiceEditPage', [
            'service' => $this->serviceService->getServiceForEdit($service),
            'customers' => $this->getCustomers(),
            'laptops' => $this->getLaptops(),
            'serviceCategories' => $this->getServiceCategories(),
            'statuses' => ServiceService::statusOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateServiceRequest $request, Service $service): RedirectResponse
    {
        $this->serviceService->update($service, $request->validated());

        return redirect()->route('services.index')
            ->with('success', 'Service updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service): RedirectResponse
    {
        try {
            $this->serviceService->destroy($service);

            return redirect()->route('services.index')
                ->with('success', 'Service deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('services.index')
                ->with('error', $e->getMessage());
        }
    }

    private function getCustomers()
    {
        return Customer::query()
            ->select(['id', 'name', 'phone'])
            ->orderBy('name')
            ->get()
            ->map(fn (Customer $customer): array => [
                'id' => $customer->id,
                'name' => $customer->name.' ('.$customer->phone.')',
            ]);
    }

    private function getLaptops()
    {
        return Laptop::query()
            ->select(['id', 'model_name', 'serial_number'])
            ->orderBy('model_name')
            ->get()
            ->map(fn (Laptop $laptop): array => [
                'id' => $laptop->id,
                'name' => $laptop->model_name.($laptop->serial_number ? ' - '.$laptop->serial_number : ''),
            ]);
    }

    private function getServiceCategories()
    {
        return ServiceCategory::query()
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get();
    }
}
