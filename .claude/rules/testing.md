# Testing Rules

- Use **`TestBed`** and the **`describe` / `it`** style for all tests.

## What to test

- **Smart components** (those with logic, state, and rendering) **must** be unit tested.
- **Services must** be unit tested, with appropriate mocking using **Jasmine** (spies, `createSpyObj`, etc.).
- **Dumb components** (render-only, no logic) may skip full unit tests — a basic **smoke test** (creates successfully) is enough.
