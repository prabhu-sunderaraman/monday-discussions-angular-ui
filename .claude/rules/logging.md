# Logging Rules

- **Do not use `console.xxx()` methods** (e.g. `console.log`, `console.warn`, `console.error`) anywhere in the application.
- Create a **`LoggingService`** exposing `log`, `warn`, `error`, `debug` (etc.) methods.
- Inject `LoggingService` wherever logging is required, and route all logging through it.
