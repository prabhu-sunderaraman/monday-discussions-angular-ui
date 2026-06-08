import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AppError } from '../error/app-error';
import { toAppError } from '../error/to-app-error';
import { LoggingService } from '../logging/logging.service';

/**
 * Central HTTP error handling: logs the failure via {@link LoggingService},
 * normalizes it to a clean typed {@link AppError}, and re-throws so no raw
 * `HttpErrorResponse` ever leaks to consumers. URLs are logged without query
 * params to avoid leaking any sensitive values.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggingService);

  return next(req).pipe(
    catchError((error: unknown) => {
      const appError: AppError = toAppError(error);
      const status = error instanceof HttpErrorResponse ? error.status : undefined;

      logger.error(`HTTP ${req.method} ${req.urlWithParams.split('?')[0]} failed`, {
        kind: appError.kind,
        status,
      });

      return throwError(() => appError);
    }),
  );
};
