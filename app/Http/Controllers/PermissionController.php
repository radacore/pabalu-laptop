<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;
use App\Models\Permission;
use App\Services\PermissionService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PermissionController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct(
        protected PermissionService $permissionService
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $permissions = $this->permissionService->getAllPermissions();

        return Inertia::render('permission/PermissionIndexPage', [
            'permissions' => $permissions,
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
        return Inertia::render('permission/PermissionCreatePage');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePermissionRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $this->permissionService->store($validated);

        return redirect()->route('permissions.index')
            ->with('success', __('flash.created', ['entity' => __('entities.permission').' "'.$validated['name'].'"']));
    }

    /**
     * Display the specified resource.
     */
    public function show(Permission $permission): Response
    {
        $permissionData = $this->permissionService->getPermissionForShow($permission);

        return Inertia::render('permission/PermissionShowPage', [
            'permission' => $permissionData,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Permission $permission): Response
    {
        return Inertia::render('permission/PermissionEditPage', [
            'permission' => $permission,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePermissionRequest $request, Permission $permission): RedirectResponse
    {
        $this->permissionService->update($permission, $request->validated());
        $permission->refresh();

        return redirect()->route('permissions.index')
            ->with('success', __('flash.updated', ['entity' => __('entities.permission').' "'.$permission->name.'"']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission): RedirectResponse
    {
        $name = $permission->name;
        $this->permissionService->destroy($permission);

        return redirect()->route('permissions.index')
            ->with('success', __('flash.deleted', ['entity' => __('entities.permission').' "'.$name.'"']));
    }
}
