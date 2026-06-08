// Query parameters and paginated response shapes for the policies API.

import { LineOfBusiness, PolicyStatus, Region } from './policy.model';

/** Filter, sort and pagination options for listing policies. */
export interface PolicyQuery {
  readonly page?: number;
  readonly perPage?: number;
  /** json-server sort expression, e.g. `premiumAmount` or `-effectiveDate`. */
  readonly sort?: string;
  readonly status?: PolicyStatus;
  readonly lineOfBusiness?: LineOfBusiness;
  readonly region?: Region;
  readonly flaggedForReview?: boolean;
}

/** Paginated envelope returned by json-server when `_page` is supplied. */
export interface PagedResult<T> {
  readonly first: number;
  readonly prev: number | null;
  readonly next: number | null;
  readonly last: number;
  readonly pages: number;
  readonly items: number;
  readonly data: readonly T[];
}
