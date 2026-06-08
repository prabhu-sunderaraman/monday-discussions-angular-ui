import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppError, AppErrorKind } from '../error/app-error';
import { LoggingService } from '../logging/logging.service';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let logger: { error: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    logger = { error: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: LoggingService, useValue: logger },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('normalizes the error to AppError and logs it without query params', () => {
    let caught: unknown;
    http.get('/api/policies?secret=abc').subscribe({ error: (e) => (caught = e) });

    httpMock
      .expectOne('/api/policies?secret=abc')
      .flush('boom', { status: 500, statusText: 'Server Error' });

    expect(caught).toBeInstanceOf(AppError);
    expect((caught as AppError).kind).toBe(AppErrorKind.Server);

    expect(logger.error).toHaveBeenCalledTimes(1);
    const [message, context] = logger.error.mock.calls[0];
    expect(message).toContain('/api/policies');
    expect(message).not.toContain('secret');
    expect(context).toEqual({ kind: AppErrorKind.Server, status: 500 });
    httpMock.verify();
  });

  it('passes successful responses through untouched', () => {
    let body: unknown;
    http.get('/api/policies').subscribe((res) => (body = res));

    httpMock.expectOne('/api/policies').flush([{ id: 'p1' }]);

    expect(body).toEqual([{ id: 'p1' }]);
    expect(logger.error).not.toHaveBeenCalled();
    httpMock.verify();
  });
});
