<?php

use App\Http\Controllers\Dashboard\SettingsController;
use App\Http\Controllers\Dashboard\TrackingCodesController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/customer');
Route::inertia('/customer', 'Website/Home')->name('home');

Route::inertia('/customer/references', 'Website/References')->name('references');
Route::inertia('/customer/prices', 'Website/Prices')->name('prices');
Route::inertia('/customer/blog', 'Website/Blog')->name('blog');
Route::inertia('/customer/catalog', 'Website/Catalog')->name('catalog');

Route::inertia('/customer/login', 'Website/Login')->name('login');

Route::inertia('/customer/imprint', 'Website/Imprint')->name('imprint');
Route::inertia('/customer/privacy-policy', 'Website/PrivacyPolicy')->name('privacy-policy');

Route::get('/dashboard/tracking-codes', [
    TrackingCodesController::class,
    'index',
])->name('dashboard.tracking-codes');

Route::post('/dashboard/tracking-codes', [
    TrackingCodesController::class,
    'store',
])->name('dashboard.tracking-codes.store');

Route::post('/dashboard/tracking-codes/{trackingCode}', [
    TrackingCodesController::class,
    'update',
])->name('dashboard.tracking-codes.update');

Route::delete('/dashboard/tracking-codes/{trackingCode}', [
    TrackingCodesController::class,
    'destroy',
])->name('dashboard.tracking-codes.destroy');

Route::get('/dashboard/settings', [SettingsController::class, 'index'])
    ->name('dashboard.settings');
Route::post('/dashboard/settings', [SettingsController::class, 'update'])
    ->name('dashboard.settings.update');

Route::get('/flash-test/error', function () {
    return redirect()->route('home')->with('error', 'Flash error test message');
})->name('flash-test.error');

Route::get('/flash-test/success', function () {
    return redirect()->route('home')->with('success', 'Flash success test message');
})->name('flash-test.success');
