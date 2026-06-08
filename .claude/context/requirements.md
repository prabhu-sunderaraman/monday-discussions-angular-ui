# APAC-2849
# Policy Overview Dashboard — Angular Frontend (Policy List Component)
# ─────────────────────────────────────────────────────────────
# Story
# ─────────────────────────────────────────────────────────────

As an APAC operations user,
I want to see a paginated list of my policies on the dashboard,
So that I can quickly scan status, premium, and expiry across my portfolio.

# ─────────────────────────────────────────────────────────────
# Background
# ─────────────────────────────────────────────────────────────

The BFF endpoint is ready at GET /api/policies?page=0&size=20.
Response shape is confirmed (see API contract on Confluence).
This ticket covers the Angular component that consumes that endpoint
and renders the policy list with server-side pagination.

Tech stack: Angular 17, Angular Material, RxJS, HttpClient.
State management: signals (no NgRx for this component).
Auth: JWT token is attached by an existing HttpInterceptor — 
      the component does not handle auth.

# ─────────────────────────────────────────────────────────────
# API response shape (from BFF)
# ─────────────────────────────────────────────────────────────

{
  "content": [
    {
      "policyNumber": "POL-2024-SG-00123",
      "holderName": "Tan Wei Ming",
      "region": "Singapore",
      "status": "Active",
      "premiumFormatted": "SGD 1,200.00",
      "durationDays": 365,
      "isExpiringSoon": false
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 84,
  "totalPages": 5
}

# ─────────────────────────────────────────────────────────────
# Acceptance Criteria
# ─────────────────────────────────────────────────────────────

AC1 — Policy list renders
  Given the user lands on the dashboard
  When the component loads
  Then it calls GET /api/policies?page=0&size=20
  And renders a table with columns:
      Policy Number | Holder | Region | Status | Premium | Expiring Soon

AC2 — Pagination
  Given the response contains totalPages > 1
  Then Angular Material paginator is shown below the table
  And clicking next/previous calls the API with updated page param
  And the table updates without full page reload

AC3 — Expiry indicator
  Given isExpiringSoon is true for a policy
  Then that row shows a visible warning indicator (icon or badge)
  And the indicator is not shown when isExpiringSoon is false

AC4 — Loading state
  Given the API call is in flight
  Then a loading spinner is shown
  And the table is not visible until data arrives

AC5 — Error state
  Given the API returns a non-2xx response
  Then an error message is shown to the user
  And the table is hidden
  And the user can retry (button or auto-retry not specified — dev to decide)

AC6 — Empty state
  Given the API returns totalElements = 0
  Then a "No policies found" message is shown
  And the paginator is hidden

AC7 — Accessibility
  The table must have aria-labels on sortable columns.
  Loading and error states must be announced to screen readers.
