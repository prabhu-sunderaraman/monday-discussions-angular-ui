import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppError, AppErrorKind } from '../../infrastructure/error/app-error';
import {
  Currency,
  LineOfBusiness,
  Policy,
  PolicyStatus,
  Region,
} from '../../core/models/policy.model';
import { PolicyService } from '../../core/services/policy.service';
import { DashboardComponent } from './dashboard.component';

function makePolicy(overrides: Partial<Policy> = {}): Policy {
  return {
    id: 'p1',
    policyNumber: 'POL-000001',
    policyholderName: 'Wei Tan',
    lineOfBusiness: LineOfBusiness.Property,
    status: PolicyStatus.Active,
    premiumAmount: 1000,
    currency: Currency.SGD,
    effectiveDate: '2025-01-01',
    expiryDate: '2026-01-01',
    region: Region.Singapore,
    underwriter: 'Mei Lim',
    flaggedForReview: false,
    ...overrides,
  };
}

function createServiceStub() {
  return {
    policies: signal<readonly Policy[]>([]),
    loading: signal(false),
    error: signal<AppError | null>(null),
    total: signal(0),
    activeCount: signal(0),
    flaggedCount: signal(0),
    loadPolicies: vi.fn(),
  };
}

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let service: ReturnType<typeof createServiceStub>;

  beforeEach(() => {
    service = createServiceStub();
    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [{ provide: PolicyService, useValue: service }],
    });
    fixture = TestBed.createComponent(DashboardComponent);
  });

  it('loads policies on init', () => {
    fixture.detectChanges();
    expect(service.loadPolicies).toHaveBeenCalledTimes(1);
  });

  it('renders the table and summary counts when data is loaded', () => {
    service.policies.set([makePolicy({ id: 'p1' }), makePolicy({ id: 'p2' })]);
    service.total.set(2);
    service.activeCount.set(2);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-policy-table')).not.toBeNull();
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(2);
  });

  it('shows a loading status and hides the table while loading', () => {
    service.loading.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="status"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('app-policy-table')).toBeNull();
  });

  it('shows an alert with a retry button on error and reloads when clicked', () => {
    service.error.set(new AppError(AppErrorKind.Server, 'Server failed'));
    fixture.detectChanges();

    const alert = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('Server failed');

    const retry: HTMLButtonElement = fixture.nativeElement.querySelector('.dashboard__retry');
    retry.click();
    // once on init, once on retry click
    expect(service.loadPolicies).toHaveBeenCalledTimes(2);
  });
});
