// Clean, typed error surfaced to callers in place of raw HttpErrorResponse.

export enum AppErrorKind {
  Network = 'Network',
  NotFound = 'NotFound',
  Validation = 'Validation',
  Server = 'Server',
  Unknown = 'Unknown',
}

export class AppError extends Error {
  constructor(
    readonly kind: AppErrorKind,
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'AppError';
    // Restore prototype chain for `instanceof` after transpilation to ES5+.
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
