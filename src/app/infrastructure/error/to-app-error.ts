import { HttpErrorResponse } from '@angular/common/http';

import { API_ERROR_MESSAGES } from '../i18n/api-error-messages';
import { AppError, AppErrorKind } from './app-error';

/** Normalizes any thrown value into a clean, typed {@link AppError}. */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof HttpErrorResponse) {
    return fromHttpError(error);
  }

  return new AppError(AppErrorKind.Unknown, API_ERROR_MESSAGES.UNKNOWN);
}

function fromHttpError(error: HttpErrorResponse): AppError {
  const { status } = error;

  if (status === 0) {
    return new AppError(AppErrorKind.Network, API_ERROR_MESSAGES.NETWORK, status);
  }
  if (status === 404) {
    return new AppError(AppErrorKind.NotFound, API_ERROR_MESSAGES.NOT_FOUND, status);
  }
  if (status >= 500) {
    return new AppError(AppErrorKind.Server, API_ERROR_MESSAGES.SERVER, status);
  }
  if (status >= 400) {
    return new AppError(AppErrorKind.Validation, API_ERROR_MESSAGES.VALIDATION, status);
  }

  return new AppError(AppErrorKind.Unknown, API_ERROR_MESSAGES.UNKNOWN, status);
}
