# Testing Rules

- Use **Vitest** (the Angular default test runner via `@angular/build:unit-test`) for all tests.
- Write tests in the **`describe` / `it`** style using Vitest globals (`describe`, `it`, `expect`, `beforeEach`).
- Use Angular's **`TestBed`** to configure and render components/services under test (this is the standard Angular harness and runs under Vitest).
- Do **not** use Jasmine or Karma. For mocking, use **Vitest** APIs (`vi.fn()`, `vi.spyOn()`, `vi.mock()`) — not `jasmine.createSpyObj`.

## What to test

- **Smart components** (those with logic, state, and rendering) **must** be unit tested with `TestBed`.
- **Services must** be unit tested, with appropriate mocking using **Vitest** (`vi.fn()`, `vi.spyOn()`).
- **Dumb components** (render-only, no logic) may skip full unit tests — a basic **smoke test** (creates successfully via `TestBed`) is enough.
