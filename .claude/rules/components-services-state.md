# Components, Services & State Rules

## Components

- Use **standalone components** only. Do not create or use `NgModule`.
- **No inline templates.** Every component uses an external `templateUrl` (a separate `.html` file).
- Use **signal-based `input()` and `output()`** instead of the `@Input()` and `@Output()` decorators.
- Add **ARIA attributes** on all UI elements for accessibility.

## Services

- **One service per domain**, each in its own file.
- **No UI code or UI-related state** in service files (no DOM, components, or view concerns).
- All **HTTP calls live inside services** and use Angular's `HttpClient` — never `fetch` or the `XMLHttpRequest` API.
- **Do not swallow HTTP errors.** Catch and rethrow a clean, typed error instead of returning empty/default values.

## State Management

- Use **signals** for state management. Do **not** use NgRx (or any external state library).
- Manage state in **services** using signals.
