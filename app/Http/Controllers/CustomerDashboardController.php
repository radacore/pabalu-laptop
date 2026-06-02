<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $customer = $request->user()->customer;
        $serviceQuery = Service::query()->where('customer_id', $customer?->id ?? 0);

        return Inertia::render('customer-dashboard/CustomerDashboardPage', [
            'customer' => $customer,
            'services' => (clone $serviceQuery)
                ->with(['serviceCategory', 'laptop.brand'])
                ->latest()
                ->paginate(10)
                ->withQueryString(),
            'stats' => [
                'total_services' => (clone $serviceQuery)->count(),
                'active_services' => (clone $serviceQuery)
                    ->whereNotIn('status', ['completed', 'cancelled'])
                    ->count(),
                'completed_services' => (clone $serviceQuery)
                    ->where('status', 'completed')
                    ->count(),
            ],
        ]);
    }
}
