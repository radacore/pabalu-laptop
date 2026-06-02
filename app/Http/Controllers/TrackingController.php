<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Services\ServiceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TrackingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('tracking/TrackingPage', [
            'service' => null,
            'statuses' => ServiceService::statusOptions(),
        ]);
    }

    public function show(Request $request): Response|RedirectResponse
    {
        $request->merge([
            'tracking_code' => $request->route('tracking_code'),
        ]);

        $validated = $request->validate([
            'tracking_code' => ['required', 'string'],
        ]);

        $service = Service::query()
            ->where('tracking_code', $validated['tracking_code'])
            ->with([
                'customer',
                'laptop.brand',
                'serviceCategory',
                'updates' => fn ($query) => $query
                    ->where('is_customer_visible', true)
                    ->orderBy('created_at'),
                'parts',
                'photos',
            ])
            ->first();

        if (! $service) {
            return redirect()->back()
                ->with('error', __('tracking')['not_found']);
        }

        return Inertia::render('tracking/TrackingPage', [
            'service' => $service,
            'statuses' => ServiceService::statusOptions(),
        ]);
    }
}
