<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\TrackingCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TrackingCodesController extends Controller
{
    public function index(): Response
    {
        $trackingCodes = TrackingCode::query()
            ->orderBy('created_at', 'desc')
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
            });

        return Inertia::render('Dashboard/TrackingCodes/TrackingCodes', [
            'trackingCodes' => $trackingCodes,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('tracking_codes', 'name'),
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (!is_string($value) || trim($value) === '') {
                        $fail('Please enter a valid tracking code name.');
                    }
                },
            ],
            'isExternal' => [
                'required',
                'boolean',
            ],
            'placement' => [
                'required',
                'string',
                'in:head,body_start,body_end',
            ],
            'isActive' => [
                'required',
                'boolean',
            ],
            'scriptCode' => [
                'required',
                'string',
                Rule::unique('tracking_codes', 'script_code'),
                function (string $attribute, mixed $value, \Closure $fail): void {
                    $script = (string) $value;

                    if (trim($script) === '') {
                        $fail('Please paste your tracking code script.');
                    }

                    // Users should paste script content without <script> tags.
                    if (preg_match('/<\s*\/?\s*script\b/i', $script) === 1) {
                        $fail('Please paste script content without <script> tags.');
                    }
                },
            ],
        ]);

        $name = trim((string) $validated['name']);
        $scriptCode = trim((string) $validated['scriptCode']);
        $isExternal = (bool) $validated['isExternal'];
        $placement = (string) $validated['placement'];
        $isActive = (bool) $validated['isActive'];

        DB::transaction(function () use ($name, $scriptCode, $isExternal, $placement, $isActive): void {
            TrackingCode::query()->create([
                'name' => $name,
                'script_code' => $scriptCode,
                'is_external' => $isExternal,
                'placement' => $placement,
                'is_active' => $isActive,
            ]);
        });

        return redirect()->route('dashboard.tracking-codes')->with(
            'success',
            'Tracking code created successfully.',
        );
    }

    public function update(Request $request, TrackingCode $trackingCode): RedirectResponse
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('tracking_codes', 'name')->ignore($trackingCode->id),
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (!is_string($value) || trim($value) === '') {
                        $fail('Please enter a valid tracking code name.');
                    }
                },
            ],
            'isExternal' => [
                'required',
                'boolean',
            ],
            'placement' => [
                'required',
                'string',
                'in:head,body_start,body_end',
            ],
            'isActive' => [
                'required',
                'boolean',
            ],
            'scriptCode' => [
                'required',
                'string',
                Rule::unique('tracking_codes', 'script_code')->ignore($trackingCode->id),
                function (string $attribute, mixed $value, \Closure $fail): void {
                    $script = (string) $value;

                    if (trim($script) === '') {
                        $fail('Please paste your tracking code script.');
                    }

                    if (preg_match('/<\s*\/?\s*script\b/i', $script) === 1) {
                        $fail('Please paste script content without <script> tags.');
                    }
                },
            ],
        ]);

        $name = trim((string) $validated['name']);
        $scriptCode = trim((string) $validated['scriptCode']);
        $isExternal = (bool) $validated['isExternal'];
        $placement = (string) $validated['placement'];
        $isActive = (bool) $validated['isActive'];

        DB::transaction(function () use ($trackingCode, $name, $scriptCode, $isExternal, $placement, $isActive): void {
            $trackingCode->update([
                'name' => $name,
                'script_code' => $scriptCode,
                'is_external' => $isExternal,
                'placement' => $placement,
                'is_active' => $isActive,
            ]);
        });

        return redirect()->route('dashboard.tracking-codes')->with(
            'success',
            'Tracking code updated successfully.',
        );
    }

    public function destroy(TrackingCode $trackingCode): RedirectResponse
    {
        DB::transaction(function () use ($trackingCode): void {
            $trackingCode->delete();
        });

        return redirect()->route('dashboard.tracking-codes')->with(
            'success',
            'Tracking code deleted successfully.',
        );
    }
}

