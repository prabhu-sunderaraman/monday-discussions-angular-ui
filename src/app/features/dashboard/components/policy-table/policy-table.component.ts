import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { POLICY_TABLE_TEXT } from '../../../../infrastructure/i18n/policy-table-text';
import { Policy, PolicyStatus } from '../../../../core/models/policy.model';

const STATUS_MODIFIER: Readonly<Record<PolicyStatus, string>> = {
  [PolicyStatus.Active]: 'active',
  [PolicyStatus.Pending]: 'pending',
  [PolicyStatus.Expired]: 'expired',
  [PolicyStatus.Cancelled]: 'cancelled',
};

/**
 * Presentational table of policies. Receives data via input only and renders
 * it — no data fetching, no state, no outputs.
 */
@Component({
  selector: 'app-policy-table',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './policy-table.component.html',
  styleUrl: './policy-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolicyTableComponent {
  readonly policies = input.required<readonly Policy[]>();

  protected readonly text = POLICY_TABLE_TEXT;

  protected statusModifier(status: PolicyStatus): string {
    return STATUS_MODIFIER[status];
  }

  protected trackById(_index: number, policy: Policy): string {
    return policy.id;
  }
}
