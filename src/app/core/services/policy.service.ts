import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';

import { APP_CONFIG } from '../../infrastructure/config/app.config';
import { AppError } from '../../infrastructure/error/app-error';
import { toAppError } from '../../infrastructure/error/to-app-error';
import { PagedResult, PolicyQuery } from '../models/policy-query.model';
import {
  Policy,
  PolicyCreateInput,
  PolicyStatus,
  PolicyUpdateInput,
} from '../models/policy.model';

const POLICIES_RESOURCE = 'policies';
const PAGE_SIZE_DEFAULT = 25;
const PAGE_DEFAULT = 1;

/**
 * Owns all policy data access and the client-side policy state.
 * HTTP errors are normalized to {@link AppError} and re-thrown — never swallowed.
 */
@Injectable({ providedIn: 'root' })
export class PolicyService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(APP_CONFIG).apiBaseUrl}/${POLICIES_RESOURCE}`;

  private readonly _policies = signal<readonly Policy[]>([]);
  private readonly _total = signal(0);
  private readonly _loading = signal(false);
  private readonly _error = signal<AppError | null>(null);

  readonly policies: Signal<readonly Policy[]> = this._policies.asReadonly();
  readonly total: Signal<number> = this._total.asReadonly();
  readonly loading: Signal<boolean> = this._loading.asReadonly();
  readonly error: Signal<AppError | null> = this._error.asReadonly();

  readonly activeCount: Signal<number> = computed(
    () => this._policies().filter((p) => p.status === PolicyStatus.Active).length,
  );
  readonly flaggedCount: Signal<number> = computed(
    () => this._policies().filter((p) => p.flaggedForReview).length,
  );

  /** Fetches a page of policies and updates the service state signals. */
  loadPolicies(query: PolicyQuery = {}): void {
    this._loading.set(true);
    this._error.set(null);

    this.http
      .get<PagedResult<Policy>>(this.baseUrl, { params: this.buildParams(query) })
      .pipe(catchError((err: unknown) => this.fail(err)))
      .subscribe({
        next: (result) => {
          this._policies.set(result.data);
          this._total.set(result.items);
          this._loading.set(false);
        },
        error: (err: AppError) => {
          this._error.set(err);
          this._loading.set(false);
        },
      });
  }

  getById(id: string): Observable<Policy> {
    return this.http
      .get<Policy>(`${this.baseUrl}/${id}`)
      .pipe(catchError((err: unknown) => this.fail(err)));
  }

  createPolicy(input: PolicyCreateInput): Observable<Policy> {
    return this.http
      .post<Policy>(this.baseUrl, input)
      .pipe(catchError((err: unknown) => this.fail(err)));
  }

  updatePolicy(id: string, patch: PolicyUpdateInput): Observable<Policy> {
    return this.http
      .patch<Policy>(`${this.baseUrl}/${id}`, patch)
      .pipe(catchError((err: unknown) => this.fail(err)));
  }

  deletePolicy(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this._policies.update((list) => list.filter((p) => p.id !== id))),
      catchError((err: unknown) => this.fail(err)),
    );
  }

  flagForReview(id: string, flagged: boolean): Observable<Policy> {
    return this.updatePolicy(id, { flaggedForReview: flagged });
  }

  private buildParams(query: PolicyQuery): HttpParams {
    let params = new HttpParams()
      .set('_page', String(query.page ?? PAGE_DEFAULT))
      .set('_per_page', String(query.perPage ?? PAGE_SIZE_DEFAULT));

    if (query.sort) {
      params = params.set('_sort', query.sort);
    }
    if (query.status) {
      params = params.set('status', query.status);
    }
    if (query.lineOfBusiness) {
      params = params.set('lineOfBusiness', query.lineOfBusiness);
    }
    if (query.region) {
      params = params.set('region', query.region);
    }
    if (query.flaggedForReview !== undefined) {
      params = params.set('flaggedForReview', String(query.flaggedForReview));
    }
    return params;
  }

  private fail(error: unknown): Observable<never> {
    return throwError(() => toAppError(error));
  }
}
