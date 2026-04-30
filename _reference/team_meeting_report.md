# Civic Issues Tracker Team Report

## Summary

This report captures the frontend work completed so far, with emphasis on the organization admin dashboard and the reporting flow, plus the backend routes currently used, the current testing status, and the items that still need team decisions in tomorrow's meeting.

## Frontend Work Completed

### Organization Admin Dashboard

The organization admin area now has a dedicated route group under `/organization-admin` with its own layout and sidebar.

What was built (UI surface, now mapped to organization admin):
-- `OrganizationAdminDashboardLayout` (wrapper for the existing dashboard layout) and a dedicated organization admin sidebar.
- `SidebarOrganizationAdmin` navigation for the main operational sections.
- Dashboard, map, analytics, messages, settings, and alerts pages (UI under `dashboard-organization-admin/*`).
- `organizationAdminWorkspace.ts` (re-exports the existing workspace seeding logic) to seed tickets, resolved tickets, and chat threads from the signed-in user.

What the organization admin UI currently does:
- Shows a ticket queue with status chips and priority styling.
- Lets the organization admin cycle ticket status locally.
- Opens the district map from the queue view.
- Shows assigned ticket details, reporter info, and dispatch actions.
- Provides a map-based incident view with custom pins and a live feed.
- Shows a resolved-tickets archive with KPI cards and report modal.
- Supports local-only message sending in the message center.
- Displays settings controls and notification cards.

### Report Flow

The report form is connected to the backend for category/subcategory loading and submits the issue payload from the frontend.

What was built:
- Report form UI with category, subcategory, location, description, and photo upload.
- Map picker and geolocation support.
- Preview handling for uploaded images.
- Backend category and subcategory fetching.
- Form submission using `privateApi.post('/issues/report/', ...)`.

## Routes Used

### Frontend Routes

Defined in `src/app/routes.tsx`.

Public and auth routes:
- `/`
- `/login`
- `/signup`
- `/reset-password`
- `/report`
- `/local-reports`

Organization admin routes (new):
- `/organization-admin/dashboard`
- `/organization-admin/map`
- `/organization-admin/resolved`
- `/organization-admin/messages`
- `/organization-admin/settings`
- `/organization-admin/notifications`

### Backend Routes

Backend root routing is mounted through `config/urls.py`.

Auth backend:
- `/api/v1/auth/register/resident/`
- `/api/v1/auth/verify-otp/`
- `/api/v1/auth/resend-otp/`
- `/api/v1/auth/login/`
- `/api/v1/auth/logout/`
- `/api/v1/auth/profile/`
- `/api/v1/auth/token/refresh/`
- `/api/v1/auth/forgot-password/`
- `/api/v1/auth/reset-password/`
- `/api/v1/auth/verify-reset-otp/`
- `/api/v1/auth/admin/create-org-admin/`
- `/api/v1/auth/complete-registration/`
- `/api/v1/auth/set-password/`
- `/api/v1/auth/register/system-admin/`
- `/api/v1/auth/system-admin-status/`

Organization and category backend:
- `/api/v1/organizations/`
- `/api/v1/organizations/inactive/`
- `/api/v1/organizations/<uuid>/`
- `/api/v1/organizations/<uuid>/activate/`
- `/api/v1/categories/`
- `/api/v1/categories/inactive/`
- `/api/v1/categories/<uuid>/`
- `/api/v1/categories/<uuid>/activate/`
- `/api/v1/categories/<uuid>/organizations/`
- `/api/v1/categories/<uuid>/organizations/<uuid>/`
- `/api/v1/subcategories/`
- `/api/v1/subcategories/inactive/`
- `/api/v1/subcategories/<uuid>/`
- `/api/v1/subcategories/<uuid>/activate/`

## Backend Used So Far

### Auth Backend

The auth backend is active and used by the frontend for registration, OTP verification, login, profile retrieval, and password reset.

Relevant backend files:
- `Backend/apps/accounts/urls.py`
- `Backend/apps/accounts/views.py`
- `Backend/apps/accounts/models.py`
- `Backend/apps/accounts/serializers.py`

### Organization Backend

The report form depends on categories and subcategories, and those come from the organizations app.

Relevant backend files:
- `Backend/apps/organizations/urls.py`
- `Backend/apps/organizations/views.py`
- `Backend/apps/organizations/models.py`
- `Backend/apps/organizations/serializers.py`

### Issues Backend

The issues backend is still a placeholder.

Current state:
- `Backend/apps/issues/models.py` exists as a placeholder model.
- `Backend/apps/issues/views.py` is empty.
- No issues routes are mounted in `Backend/config/urls.py`.

That means the report submit request currently depends on a frontend call path that does not yet have a matching backend endpoint.

### Organization Admin Backend

There is no real backend API yet for organization admin dashboard operations.

Current state:
- Organization admin queue data is seeded from the frontend workspace helper.
- Status changes are local-only.
- Message sending is local-only.
- Alerts, analytics, and settings are frontend UI only.

## Testing Status

### What Exists

-- Backend Postman collection and guide for auth, organizations, categories, subcategories, and admin setup.
-- Manual frontend validation for the organization admin dashboard and the report flow.

### What Is Missing

-- No real frontend automated tests were found for organization admin or report flows.
- Backend test files are still placeholders in the affected apps.
- No backend endpoint exists yet for issue submission.
-- No backend endpoints exist yet for organization admin actions, messages, notifications, or analytics.

### Manual Testing We Can Report

Organization admin dashboard:
- Dashboard loads under `/organization-admin/dashboard`.
- Ticket selection switches the active ticket.
- Status button cycles ticket state locally.
- Directions action navigates to the map view.
- Dispatch action buttons give success feedback.
- Message center supports local thread switching and message creation.
- Settings and notifications pages render correctly.

Report flow:
- Login-protected report page loads.
- Categories and subcategories load from backend APIs.
- Subcategories change based on category selection.
- Geolocation can fill the location data.
- Map click updates coordinates and address.
- Image preview works for photo upload.
- Submit path exists in frontend, but backend endpoint support is still incomplete.

### What We Still Need For The Meeting

### Backend Decisions Needed

- Confirm the final endpoint for issue submission.
- Confirm the shape of the report payload.
- Confirm whether organization admin status updates should be separate endpoints or part of a single workflow API.
- Confirm where organization admin messages, alerts, and resolved-history data will live in the backend.

### Frontend Decisions Needed

- Decide whether to keep the organization admin dashboard seeded until the backend is ready.
- Decide whether to block report submission until the real issues endpoint is added.
- Decide the naming and route shape for the final issue and organization admin APIs.

### Team Actions Needed

- Add backend support for `/issues/report/`.
-- Add backend endpoints for organization admin queue, map, message, alerts, and resolved-report data.
-- Add automated tests for auth, organization/category APIs, report submission, and organization admin workflow endpoints.
-- Align the Postman collection with the final report and organization admin routes.

## Short Version For The Meeting

The frontend organization admin dashboard is built and usable, but it is still seeded and not fully backend-driven. The report page is partly backend-connected for categories and subcategories, but issue submission still needs a real backend endpoint. Auth and organization/category APIs already exist and are usable. The biggest blockers are the missing issues endpoint and the missing organization admin backend APIs.