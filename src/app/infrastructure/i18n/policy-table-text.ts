// User-facing text for the policy table (English only for now).

export const POLICY_TABLE_TEXT = {
  CAPTION: 'List of insurance policies',
  EMPTY: 'No policies available.',
  COLUMNS: {
    POLICY_NUMBER: 'Policy number',
    POLICYHOLDER: 'Policyholder',
    LINE_OF_BUSINESS: 'Line of business',
    STATUS: 'Status',
    PREMIUM: 'Premium',
    REGION: 'Region',
    EFFECTIVE_DATE: 'Effective date',
    EXPIRY_DATE: 'Expiry date',
    UNDERWRITER: 'Underwriter',
    FLAGGED: 'Flagged',
  },
  FLAGGED_YES: 'Yes',
  FLAGGED_NO: 'No',
  FLAGGED_BADGE_LABEL: 'Flagged for review',
} as const;
