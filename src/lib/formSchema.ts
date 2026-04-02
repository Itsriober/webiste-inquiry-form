import { z } from 'zod';

export const baseSchema = z.object({
  // Step 1
  businessType: z.string().min(1, 'Please select a business type'),
  businessTypeOther: z.string().optional().default(''),
  hasExistingSite: z.string().min(1, 'Please indicate if you have an existing site'),

  // Step 2
  websitePurpose: z.array(z.string()).min(1, 'Select at least one purpose'),
  websitePurposeOther: z.string().optional().default(''),
  targetAudience: z.string().min(1, 'Please select a target audience'),

  // Step 3
  pagesNeeded: z.array(z.string()).min(1, 'Select at least one page'),
  pagesNeededOther: z.string().optional().default(''),
  contentSource: z.string().min(1, 'Please indicate your content source'),

  // Step 4
  featuresNeeded: z.array(z.string()).min(1, 'Select at least one feature or "None of the above"'),
  featuresNeededOther: z.string().optional().default(''),
  needsCMS: z.string().min(1, 'Please indicate if you need a CMS'),

  // Step 5
  brandStatus: z.string().min(1, 'Please select your brand status'),
  designStyle: z.string().min(1, 'Please select a design style'),
  referenceUrls: z.string().optional().default(''),

  // Step 6
  timeline: z.string().min(1, 'Please select a timeline'),
  budgetRange: z.string().min(1, 'Please select a budget range'),

  // Step 7
  additionalNotes: z.string().optional().default(''),
  clientName: z.string().min(1, 'Your name is required'),
  clientCompany: z.string().optional().default(''),
  clientEmail: z.string().email('Please enter a valid email address'),
  clientPhone: z.string().optional().default(''),
});

export const briefFormSchema = baseSchema.superRefine((data, ctx) => {
  if (data.businessType === 'Other' && !data.businessTypeOther) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify your business type',
      path: ['businessTypeOther'],
    });
  }

  if (data.websitePurpose.includes('Other') && !data.websitePurposeOther) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify your website goal',
      path: ['websitePurposeOther'],
    });
  }

  if (data.pagesNeeded.includes('Other') && !data.pagesNeededOther) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify other pages',
      path: ['pagesNeededOther'],
    });
  }

  if (data.featuresNeeded.includes('Other') && !data.featuresNeededOther) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify other features',
      path: ['featuresNeededOther'],
    });
  }
});

export type BriefFormSchema = z.infer<typeof briefFormSchema>;
export const STEP_FIELDS: Record<number, (keyof BriefFormSchema)[]> = {
  1: ['businessType', 'businessTypeOther', 'hasExistingSite'],
  2: ['websitePurpose', 'websitePurposeOther', 'targetAudience'],
  3: ['pagesNeeded', 'pagesNeededOther', 'contentSource'],
  4: ['featuresNeeded', 'featuresNeededOther', 'needsCMS'],
  5: ['brandStatus', 'designStyle', 'referenceUrls'],
  6: ['timeline', 'budgetRange'],
  7: ['additionalNotes', 'clientName', 'clientCompany', 'clientEmail', 'clientPhone'],
};
