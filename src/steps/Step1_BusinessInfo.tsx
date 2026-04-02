import type { UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import type { BriefFormData } from '../types/brief';
import ExpandableChipGroup from '../components/ui/ExpandableChipGroup';
import { businessTypeOptions, existingSiteOptions } from '../data/options';

interface StepProps {
  setValue: UseFormSetValue<BriefFormData>;
  watch: UseFormWatch<BriefFormData>;
  errors: FieldErrors<BriefFormData>;
}

export default function Step1_BusinessInfo({ setValue, watch, errors }: StepProps) {
  const businessType = watch('businessType') || '';
  const businessTypeOther = watch('businessTypeOther') || '';
  const hasExistingSite = watch('hasExistingSite') || '';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl mb-2">Tell us about your business</h2>
        <p className="text-sm text-text-secondary mb-5">
          What type of business are you building a website for?
        </p>
      </div>

      <div>
        <label className="block text-sm font-body text-text-secondary mb-3">
          Business type
        </label>
        <ExpandableChipGroup
          type="single"
          options={businessTypeOptions}
          selected={businessType}
          onChange={(val: string) => setValue('businessType', val, { shouldValidate: true })}
          otherValue={businessTypeOther}
          onOtherChange={(val: string) => setValue('businessTypeOther', val, { shouldValidate: true })}
          showMoreCount={8}
        />
        {errors.businessType && (
          <p className="mt-2 text-xs text-error flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-error" />
            {errors.businessType.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-body text-text-secondary mb-3">
          Do you have an existing website?
        </label>
        <ExpandableChipGroup
          type="single"
          options={existingSiteOptions}
          selected={hasExistingSite}
          onChange={(val: string) => setValue('hasExistingSite', val, { shouldValidate: true })}
          showMoreCount={8}
        />
        {errors.hasExistingSite && (
          <p className="mt-2 text-xs text-error flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-error" />
            {errors.hasExistingSite.message}
          </p>
        )}
      </div>
    </div>
  );
}
