export interface BriefFormData {
  // Step 1 — Business Info
  businessType: string;
  businessTypeOther?: string;
  hasExistingSite: string;
  currentUrl?: string;

  // Step 2 — Website Purpose
  websitePurpose: string[];
  websitePurposeOther?: string;
  targetAudience: string;

  // Step 3 — Pages & Content
  pagesNeeded: string[];
  pagesNeededOther?: string;
  contentSource: string;

  // Step 4 — Features
  featuresNeeded: string[];
  featuresNeededOther?: string;
  needsCMS: string;

  // Step 5 — Design Preferences
  brandStatus: string;
  designStyle: string;
  referenceUrls?: string;

  // Step 6 — Timeline & Budget
  timeline: string;
  budgetRange: string;

  // Step 7 — Final Details
  additionalNotes?: string;
  clientName: string;
  clientCompany?: string;
  clientEmail: string;
  clientPhone?: string;
}

export const STEP_TITLES: Record<number, string> = {
  1: 'Business Info',
  2: 'Website Purpose',
  3: 'Pages & Content',
  4: 'Features',
  5: 'Design Preferences',
  6: 'Timeline & Budget',
  7: 'Final Details',
};
