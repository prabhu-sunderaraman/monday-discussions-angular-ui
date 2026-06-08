# Coding Standards

## TypeScript
- Strict mode enabled in `tsconfig.json` (`strict: true`). No exceptions.
- No `any`. Use `unknown` for genuinely unknown types and narrow with type guards.
- Explicit return types on all public functions and methods.
- `readonly` on all properties that do not change after initialisation.
- Enums for all fixed value sets — status, region, currency, line of business.
- Interfaces for data shapes. Classes for behaviour.
- No barrel files (`index.ts`). Import directly from the source file.

## File Size Limits
- Any `.ts` file: 300 lines maximum.
- Any `.html` template: 150 lines maximum.
- Any `.scss` file: 200 lines maximum.
- Any function or method: 30 lines maximum.
- Any class: 10 public methods maximum.
- When a limit is approached, split the file before continuing.

## Naming Conventions
- Components: PascalCase + Component suffix — PolicyTableComponent
- Services: PascalCase + Service suffix — PolicyService
- Interfaces: PascalCase, no I prefix — Policy, FilterParams
- Enums: PascalCase — PolicyStatus, LineOfBusiness
- Signals: camelCase noun — policies, selectedIds
- Computed signals: camelCase adjective/noun — filteredPolicies, activeCount
- Files: kebab-case — policy-table.component.ts
- SCSS tokens: --kebab-case — --color-surface-primary
- Constants: UPPER_SNAKE_CASE — PAGE_SIZE_DEFAULT
- Storage keys: UPPER_SNAKE_CASE — STORAGE_KEY_THEME

## Test Files
- Every `.spec.ts` file lives co-located next to the file it tests.
- No separate `__tests__` folders.
- Deleting a source file means deleting its spec file — they travel together.

## THINGS YOU SHOULD NEVER DO

- `any` in TypeScript.
- Raw `localStorage` or `sessionStorage` calls outside StorageService.
- `console.*` calls outside LoggingService.
- A component that injects HttpClient directly.
- A service that mixes two unrelated domains.
- Hardcoded API URLs or magic values in services.
- Hardcoded UI strings in templates or component classes.
- A component without ChangeDetectionStrategy.OnPush.
- Swallowed errors — every caught error must be logged or re-thrown.