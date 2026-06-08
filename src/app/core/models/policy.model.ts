// Domain model for an insurance policy and its fixed value sets.

export enum LineOfBusiness {
  Property = 'Property',
  Casualty = 'Casualty',
  AccidentAndHealth = 'A&H',
  Marine = 'Marine',
}

export enum PolicyStatus {
  Active = 'Active',
  Expired = 'Expired',
  Pending = 'Pending',
  Cancelled = 'Cancelled',
}

export enum Currency {
  USD = 'USD',
  SGD = 'SGD',
  HKD = 'HKD',
  AUD = 'AUD',
  JPY = 'JPY',
  THB = 'THB',
}

export enum Region {
  Singapore = 'Singapore',
  HongKong = 'Hong Kong',
  Australia = 'Australia',
  Japan = 'Japan',
  Thailand = 'Thailand',
  Indonesia = 'Indonesia',
  Malaysia = 'Malaysia',
  Philippines = 'Philippines',
}

/** A policy record as returned by the API. Dates are ISO `YYYY-MM-DD` strings. */
export interface Policy {
  readonly id: string;
  readonly policyNumber: string;
  readonly policyholderName: string;
  readonly lineOfBusiness: LineOfBusiness;
  readonly status: PolicyStatus;
  readonly premiumAmount: number;
  readonly currency: Currency;
  readonly effectiveDate: string;
  readonly expiryDate: string;
  readonly region: Region;
  readonly underwriter: string;
  readonly flaggedForReview: boolean;
}

/** Fields accepted when creating a policy (server assigns `id`). */
export type PolicyCreateInput = Omit<Policy, 'id'>;

/** Partial update — any subset of mutable fields. */
export type PolicyUpdateInput = Partial<Omit<Policy, 'id'>>;
