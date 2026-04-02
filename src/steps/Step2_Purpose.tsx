import type { UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import type { BriefFormData } from '../types/brief';
import ExpandableChipGroup from '../components/ui/ExpandableChipGroup';
import { websitePurposeOptions, audienceOptions } from '../data/options';

interface StepProps {
  setValue: UseFormSetValue<BriefFormData>;
  watch: UseFormWatch<BriefFormData>;
  errors: FieldErrors<BriefFormData>;
}

export default function Step2_Purpose({ setValue, watch, errors }: StepProps) {
  const websitePurpose = watch('websitePurpose') || [];
  const websitePurposeOther = watch('websitePurposeOther') || '';
  const targetAudience = watch('targetAudience') || '';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl mb-2">What should your website do?</h2>
        <p className="text-sm text-text-secondary mb-5">
          Select all the goals that apply.
        </p>
      </div>

      <div>
        <label className="block text-sm font-body text-text-secondary mb-3">
          Website goals
        </label>
        <ExpandableChipGroup
          type="multi"
          options={websitePurposeOptions}
          selected={websitePurpose}
          onChange={(val: string[]) => setValue('websitePurpose', val, { shouldValidate: true })}
          otherValue={websitePurposeOther}
          onOtherChange={(val: string) => setValue('websitePurposeOther', val, { shouldValidate: true })}
          showMoreCount={8}
        />
        {errors.websitePurpose && (
          <p className="mt-2 text-xs text-error flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-error" />
            {errors.websitePurpose.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-body text-text-secondary mb-3">
          Who is your target audience?
        </label>
        <ExpandableChipGroup
          type="single"
          options={audienceOptions}
          selected={targetAudience}
          onChange={(val: string) => setValue('targetAudience', val, { shouldValidate: true })}
          showMoreCount={8}
        />
        {errors.targetAudience && (
          <p className="mt-2 text-xs text-error flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-error" />
            {errors.targetAudience.message}
          </p>
        )}
      </div>
    </div>
  );
}
