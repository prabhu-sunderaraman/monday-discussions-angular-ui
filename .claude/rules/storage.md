# Storage Rules

- Create a **single `StorageService`** that encapsulates all `localStorage` and `sessionStorage` operations.
- **NEVER** access raw `localStorage` or `sessionStorage` directly anywhere else in the code — always go through `StorageService`.
- **All storage-related error handling** lives inside `StorageService` only.
