# alfima-task

## Task Delivery Summary

This project implements the requested cookie consent + tracking code management flow using Laravel + Inertia + React + Tailwind + shadcn/ui.

The implementation is complete for the agreed scope and includes:

- Cookie banner with Accept/Reject flow on customer-facing pages
- Tracking Codes CRUD in dashboard
- Tracking code storage and validation in backend/database
- Script execution only after consent and only on customer-facing pages
- `/customer/*` route scope for customer-facing pages
- Root (`/`) redirect to `/customer`

## Technical Stack

- Laravel: `^13.0`
- React: `^19.2.0`
- TypeScript: `^5.7.2`
- Inertia:
  - `inertiajs/inertia-laravel ^2.0`
  - `@inertiajs/react ^2.3.7`
- Tailwind CSS: `^4.0.0`
- shadcn/ui: `^4.0.8`
- Lucide React icons: `^0.577.0`

## Setup Requirements

- PHP `8.3+`
- Composer
- Node.js (LTS recommended) + npm
- SQLite database configured in `.env`

## What Was Implemented

### 1) Cookie Banner (Customer-Facing)

- Added `CookiesBanner` component: `resources/js/Common/Components/CookiesBanner.tsx`
- Banner appears on customer-facing website pages via `MarketingPage`:
  - `resources/js/Common/Components/MarketingPage.tsx`
- Two actions:
  - **Accept all** -> stores consent and enables tracking script execution
  - **Reject all** -> stores rejection and disables tracking script execution
- Consent persistence:
  - Stored in `localStorage` under a dedicated key
  - Expiration set to **30 days**
  - Banner is hidden after a valid consent decision is stored
- Added cleanup logic to remove previously injected tracking scripts when needed.

### 2) Tracking Codes CRUD (Dashboard)

- Added dashboard page:
  - `resources/js/Pages/Dashboard/TrackingCodes/TrackingCodes.tsx`
- Added reusable form fields component (to avoid duplication):
  - `resources/js/Pages/Dashboard/TrackingCodes/Components/TrackingCodeFormFields.tsx`
- Added modal flows:
  - Create/Edit/View modal:
    - `resources/js/Pages/Dashboard/TrackingCodes/Modals/TrackingCodeWizardModal.tsx`
  - Delete confirmation modal:
    - `resources/js/Pages/Dashboard/TrackingCodes/Modals/DeleteTrackingCodeModal.tsx`
- Added card/list rendering for entries:
  - `resources/js/Pages/Dashboard/TrackingCodes/Components/TrackingCodeCard.tsx`
- Added page state/actions hook:
  - `resources/js/Pages/Dashboard/TrackingCodes/Hooks/useTrackingCodes.tsx`
- CRUD endpoints wired and functional:
  - list, create, update, delete

### 3) Database + Model

- Added migration:
  - `database/migrations/2026_03_20_101140_create_tracking_codes_table.php`
- Added model:
  - `app/Models/TrackingCode.php`
- Table includes useful fields:
  - `name`
  - `script_code`
  - `is_external`
  - `placement` (`head`, `body_start`, `body_end`)
  - `is_active`
  - timestamps

### 4) Backend Controller + Validation

- Added controller:
  - `app/Http/Controllers/Dashboard/TrackingCodesController.php`
- Added validation rules:
  - `name`: required, max length, non-empty trimmed value, **unique**
  - `scriptCode`: required, non-empty trimmed value, must not include `<script>` tags, **unique**
  - `update` ignores the current record for uniqueness checks
- Added create/update/delete persistence via DB transactions.

### 5) Integration of Tracking Code Execution

- Tracking codes are shared to frontend on non-dashboard requests through:
  - `app/Http/Middleware/HandleInertiaRequests.php`
- Execution behavior:
  - Scripts run only when consent is **accepted**
  - External scripts are loaded before inline scripts
  - Placement respected (`head`, `body_start`, `body_end`)
- Dashboard execution gap was closed:
  - Removed script injection logic from `useTrackingCodes` (dashboard hook)
  - Script execution now lives in one place only: `CookiesBanner` on customer pages

### 6) Customer Route Scope (`/customer/*`)

- Updated customer-facing website routes to `/customer/*` in:
  - `routes/web.php`
- Updated navbar/header links to the new paths in:
  - `resources/js/Layouts/data.ts`
  - `resources/js/Layouts/Navbar/Navbar.tsx`
- Added redirect:
  - `/` -> `/customer`

### 7) Modal UX Improvement

- Updated dialog primitive so modals:
  - have max height of `95vh`
  - become scrollable when content exceeds viewport
- Files:
  - `resources/js/components/ui/dialog.tsx`
  - `resources/js/Pages/Dashboard/TrackingCodes/Modals/TrackingCodeWizardModal.tsx`

## Routes Added/Updated

- Customer-facing:
  - `GET /customer`
  - `GET /customer/references`
  - `GET /customer/prices`
  - `GET /customer/blog`
  - `GET /customer/catalog`
  - `GET /` -> redirects to `/customer`
- Dashboard:
  - `GET /dashboard`
  - `GET /dashboard/tracking-codes`
  - `POST /dashboard/tracking-codes`
  - `POST /dashboard/tracking-codes/{trackingCode}`
  - `DELETE /dashboard/tracking-codes/{trackingCode}`
  - `GET /dashboard/settings`
  - `POST /dashboard/settings`
