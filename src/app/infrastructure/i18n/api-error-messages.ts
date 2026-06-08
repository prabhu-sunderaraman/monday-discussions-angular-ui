// User-facing messages for normalized API errors (English only for now).

export const API_ERROR_MESSAGES = {
  NETWORK: 'Unable to reach the server. Check your connection and try again.',
  NOT_FOUND: 'The requested policy could not be found.',
  VALIDATION: 'The request was invalid. Please review the details and try again.',
  SERVER: 'The server encountered an error. Please try again later.',
  UNKNOWN: 'An unexpected error occurred.',
} as const;
