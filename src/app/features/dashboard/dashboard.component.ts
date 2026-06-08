import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';

import { PolicyService } from '../../core/services/policy.service';
import { DASHBOARD_TEXT } from '../../infrastructure/i18n/dashboard-text';
import { PolicyTableComponent } from './components/policy-table/policy-table.component';

/**
 * Smart container for the policy dashboard: triggers the load through
 * {@link PolicyService}, exposes its state signals to the template, and feeds
 * the policies into the presentational {@link PolicyTableComponent}.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PolicyTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private readonly policyService = inject(PolicyService);

  protected readonly text = DASHBOARD_TEXT;
  protected readonly policies = this.policyService.policies;
  protected readonly loading = this.policyService.loading;
  protected readonly error = this.policyService.error;
  protected readonly total = this.policyService.total;
  protected readonly activeCount = this.policyService.activeCount;
  protected readonly flaggedCount = this.policyService.flaggedCount;

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.policyService.loadPolicies();
  }
}
