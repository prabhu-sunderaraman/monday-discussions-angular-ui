# Error Handling Rules

- Use **HTTP interceptors** to handle all errors for HTTP calls centrally.
- Interceptors **log errors** via the `LoggingService` (never `console`).
- Interceptors **normalize errors** and throw back a **clean error** to the callers (no raw `HttpErrorResponse` leaking to consumers).
