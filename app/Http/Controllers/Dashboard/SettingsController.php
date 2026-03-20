<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        $cookieBannerColor = '#2F4BFE';

        $value = Setting::query()
            ->where('key', 'cookie_banner_color')
            ->value('value');

        if (is_string($value) && $value !== '') {
            $cookieBannerColor = $value;
        }

        return Inertia::render('Dashboard/Settings/Settings', [
            'savedValues' => [
                'cookieBannerColor' => $cookieBannerColor,
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'cookieBannerColor' => [
                'required',
                'string',
                'regex:/^#(?:[0-9A-F]{3}){1,2}$/i',
            ],
        ]);

        $cookieBannerColor = strtoupper($validated['cookieBannerColor']);

        DB::transaction(function () use ($cookieBannerColor) {
            Setting::query()->updateOrCreate(
                ['key' => 'cookie_banner_color'],
                ['value' => $cookieBannerColor],
            );
        });

        return redirect()->route('dashboard.settings')->with(
            'success',
            'Cookie banner color updated.'
        );
    }
}

