import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { APP_CONFIG } from '../../infrastructure/config/app.config';
import { AppError, AppErrorKind } from '../../infrastructure/error/app-error';
import { PagedResult } from '../models/policy-query.model';
import {
  Currency,
  LineOfBusiness,
  Policy,
  PolicyStatus,
  Region,
} from '../models/policy.model';
import { PolicyService } from './policy.service';

const API_BASE_URL = '/api';
const POLICIES_URL = `${API_BASE_URL}/policies`;

function makePolicy(overrides: Partial<Policy> = {}): Policy {
  return {
    id: 'p1',
    policyNumber: 'POL-000001',
    policyholderName: 'Wei Tan',
    lineOfBusiness: LineOfBusiness.Property,
    status: PolicyStatus.Active,
    premiumAmount: 12345.67,
    currency: Currency.SGD,
    effectiveDate: '2025-01-01',
    expiryDate: '2026-01-01',
    region: Region.Singapore,
    underwriter: 'Mei Lim',
    flaggedForReview: false,
    ...overrides,
  };
}

function makePage(data: Policy[]): PagedResult<Policy> {
  return {
    first: 1,
    prev: null,
    next: null,
    last: 1,
    pages: 1,
    items: data.length,
    data,
  };
}

describe('PolicyService', () => {
  let service: PolicyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PolicyService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: APP_CONFIG, useValue: { production: false, apiBaseUrl: API_BASE_URL } },
      ],
    });
    service = TestBed.inject(PolicyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('creates', () => {
    expect(service).toBeTruthy();
  });

  it('loadPolicies populates state and derived counts on success', () => {
    const data = [
      makePolicy({ id: 'p1', status: PolicyStatus.Active }),
      makePolicy({ id: 'p2', status: PolicyStatus.Expired, flaggedForReview: true }),
    ];

    service.loadPolicies();

    const req = httpMock.expectOne((r) => r.url === POLICIES_URL);
    expect(req.request.params.get('_page')).toBe('1');
    expect(req.request.params.get('_per_page')).toBe('25');
    expect(service.loading()).toBe(true);

    req.flush(makePage(data));

    expect(service.loading()).toBe(false);
    expect(service.policies().length).toBe(2);
    expect(service.total()).toBe(2);
    expect(service.activeCount()).toBe(1);
    expect(service.flaggedCount()).toBe(1);
    expect(service.error()).toBeNull();
  });

  it('loadPolicies forwards filter and pagination params', () => {
    service.loadPolicies({
      page: 3,
      perPage: 10,
      sort: '-premiumAmount',
      status: PolicyStatus.Pending,
      region: Region.Japan,
      flaggedForReview: true,
    });

    const req = httpMock.expectOne((r) => r.url === POLICIES_URL);
    const p = req.request.params;
    expect(p.get('_page')).toBe('3');
    expect(p.get('_per_page')).toBe('10');
    expect(p.get('_sort')).toBe('-premiumAmount');
    expect(p.get('status')).toBe('Pending');
    expect(p.get('region')).toBe('Japan');
    expect(p.get('flaggedForReview')).toBe('true');
    req.flush(makePage([]));
  });

  it('loadPolicies sets a normalized AppError on failure without throwing', () => {
    service.loadPolicies();

    httpMock
      .expectOne((r) => r.url === POLICIES_URL)
      .flush('boom', { status: 500, statusText: 'Server Error' });

    expect(service.loading()).toBe(false);
    expect(service.error()).toBeInstanceOf(AppError);
    expect(service.error()?.kind).toBe(AppErrorKind.Server);
  });

  it('getById re-throws a typed NotFound AppError on 404', () => {
    let caught: unknown;
    service.getById('missing').subscribe({ error: (e) => (caught = e) });

    httpMock
      .expectOne(`${POLICIES_URL}/missing`)
      .flush('nope', { status: 404, statusText: 'Not Found' });

    expect(caught).toBeInstanceOf(AppError);
    expect((caught as AppError).kind).toBe(AppErrorKind.NotFound);
  });

  it('createPolicy POSTs the input and returns the created policy', () => {
    const input = { ...makePolicy() } as Omit<Policy, 'id'>;
    let created: Policy | undefined;

    service.createPolicy(input).subscribe((p) => (created = p));

    const req = httpMock.expectOne(POLICIES_URL);
    expect(req.request.method).toBe('POST');
    req.flush(makePolicy({ id: 'new-id' }));

    expect(created?.id).toBe('new-id');
  });

  it('deletePolicy removes the policy from state on success', () => {
    service.loadPolicies();
    httpMock
      .expectOne((r) => r.url === POLICIES_URL)
      .flush(makePage([makePolicy({ id: 'p1' }), makePolicy({ id: 'p2' })]));

    service.deletePolicy('p1').subscribe();
    const req = httpMock.expectOne(`${POLICIES_URL}/p1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(service.policies().map((p) => p.id)).toEqual(['p2']);
  });

  it('flagForReview PATCHes the flaggedForReview field', () => {
    service.flagForReview('p1', true).subscribe();

    const req = httpMock.expectOne(`${POLICIES_URL}/p1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ flaggedForReview: true });
    req.flush(makePolicy({ id: 'p1', flaggedForReview: true }));
  });
});
