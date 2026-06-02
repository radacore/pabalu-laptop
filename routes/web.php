<?php

use App\Http\Controllers\CustomerDashboardController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TrackingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;

/*
|--------------------------------------------------------------------------
| Localized Routes
|--------------------------------------------------------------------------
|
| Routes wrapped with LaravelLocalization::setLocale() prefix to support
| multiple languages. The locale will be determined from the URL prefix.
|
*/
Route::group([
    'prefix' => LaravelLocalization::setLocale(),
    'middleware' => ['localeSessionRedirect', 'localizationRedirect', 'localeViewPath'],
], function () {

    Route::get('/', function () {
        return Inertia::render('home/HomePage');
    })->name('welcome');

    // Public tracking
    Route::get('/track', [TrackingController::class, 'index'])->name('tracking.index');
    Route::get('/track/{tracking_code}', [TrackingController::class, 'show'])->name('tracking.show');

    Route::middleware(['auth', 'role:Super Admin,Admin'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    });

    Route::middleware(['auth', 'role:Customer'])->group(function () {
        Route::get('/customer/dashboard', [CustomerDashboardController::class, 'index'])->name('customer.dashboard');
    });

    Route::middleware('auth')->group(function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    Route::middleware(['auth', 'role:Super Admin,Admin'])->group(function () {
        Route::resource('roles', App\Http\Controllers\RoleController::class);
        Route::resource('permissions', App\Http\Controllers\PermissionController::class);
        Route::resource('users', App\Http\Controllers\UserController::class);
        Route::resource('brands', App\Http\Controllers\BrandController::class);
        Route::resource('laptop-sources', App\Http\Controllers\LaptopSourceController::class);
        Route::resource('service-categories', App\Http\Controllers\ServiceCategoryController::class);
        Route::resource('customers', App\Http\Controllers\CustomerController::class);
        Route::resource('laptops', App\Http\Controllers\LaptopController::class);
        Route::resource('services', App\Http\Controllers\ServiceController::class);
        Route::resource('transactions', App\Http\Controllers\TransactionController::class);
    });

    require __DIR__.'/auth.php';
});
