<?php

namespace App\Http\Middleware;

use App\Models\TrackingCode;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $cookieBannerColor = '#2F4BFE';

        try {
            $value = Setting::query()
                ->where('key', 'cookie_banner_color')
                ->value('value');

            if (is_string($value) && $value !== '') {
                $cookieBannerColor = $value;
            }
        } catch (\Throwable) {
            // In case the settings table doesn't exist yet.
        }

        $path = ltrim($request->path(), '/');
        $isDashboardRoute = Str::startsWith($path, 'dashboard');

        $customerTrackingCodes = [];
        if (!$isDashboardRoute) {
            try {
                $customerTrackingCodes = TrackingCode::query()
                    ->where('is_active', true)
                    ->get(['id', 'name', 'script_code', 'is_external', 'placement', 'is_active'])
                    ->map(static function (TrackingCode $trackingCode) {
                        return [
                            'id' => $trackingCode->id,
                            'name' => $trackingCode->name,
                            'scriptCode' => $trackingCode->script_code,
                            'isExternal' => $trackingCode->is_external,
                            'placement' => $trackingCode->placement,
                            'isActive' => $trackingCode->is_active,
                        ];
                    })
                    ->values()
                    ->all();
            } catch (\Throwable) {
                // In case the tracking_codes table doesn't exist yet.
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'settings' => [
                'cookieBannerColor' => $cookieBannerColor,
            ],
            'customerTrackingCodes' => $customerTrackingCodes,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ];
    }
}
