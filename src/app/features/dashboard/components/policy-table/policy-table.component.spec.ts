import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  Currency,
  LineOfBusiness,
  Policy,
  PolicyStatus,
  Region,
} from '../../../../core/models/policy.model';
import { PolicyTableComponent } from './policy-table.component';

function makePolicy(overrides: Partial<Policy> = {}): Policy {
  return {
    id: 'p1',
    policyNumber: 'POL-000001',
    policyholderName: 'Wei Tan',
    lineOfBusiness: LineOfBusiness.Marine,
    status: PolicyStatus.Active,
    premiumAmount: 1000,
    currency: Currency.USD,
    effectiveDate: '2025-01-01',
    expiryDate: '2026-01-01',
    region: Region.Singapore,
    underwriter: 'Mei Lim',
    flaggedForReview: false,
    ...overrides,
  };
}

describe('PolicyTableComponent', () => {
  let fixture: ComponentFixture<PolicyTableComponent>;
  let componentRef: ComponentRef<PolicyTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PolicyTableComponent] });
    fixture = TestBed.createComponent(PolicyTableComponent);
    componentRef = fixture.componentRef;
  });

  it('creates with an input list of policies', () => {
    componentRef.setInput('policies', [makePolicy()]);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders one row per policy with the policy number', () => {
    componentRef.setInput('policies', [
      makePolicy({ id: 'p1', policyNumber: 'POL-000001' }),
      makePolicy({ id: 'p2', policyNumber: 'POL-000002' }),
    ]);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    const text: string = fixture.nativeElement.textContent;
    expect(rows.length).toBe(2);
    expect(text).toContain('POL-000001');
    expect(text).toContain('POL-000002');
  });

  it('shows the empty message when there are no policies', () => {
    componentRef.setInput('policies', []);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('table')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="status"]')).not.toBeNull();
  });
});
