import type { UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import type { BriefFormData } from '../types/brief';
import ExpandableChipGroup from '../components/ui/ExpandableChipGroup';
import { featuresNeededOptions, cmsOptions } from '../data/options';

interface StepProps {
  setValue: UseFormSetValue<BriefFormData>;
  watch: UseFormWatch<BriefFormData>;
  errors: FieldErrors<BriefFormData>;
}

export default function Step4_Features({ setValue, watch, errors }: StepProps) {
  const featuresNeeded = watch('featuresNeeded') || [];
  const featuresNeededOther = watch('featuresNeededOther') || '';
  const needsCMS = watch('needsCMS') || '';

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl mb-2">Features you need</h2>
        <p className="text-sm text-text-secondary mb-5">
          Select all the features your website should have.
        </p>
      </div>

      <div>
        <label className="block text-sm font-body text-text-secondary mb-3">
          Features
        </label>
        <ExpandableChipGroup
          type="multi"
          options={featuresNeededOptions}
          selected={featuresNeeded}
          onChange={(val: string[]) => setValue('featuresNeeded', val, { shouldValidate: true })}
          exclusiveOption="None of the above"
          otherValue={featuresNeededOther}
          onOtherChange={(val: string) => setValue('featuresNeededOther', val, { shouldValidate: true })}
          showMoreCount={8}
        />
        {errors.featuresNeeded && (
          <p className="mt-2 text-xs text-error flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-error" />
            {errors.featuresNeeded.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-body text-text-secondary mb-3">
          Do you need a content management system (CMS)?
        </label>
        <ExpandableChipGroup
          type="single"
          options={cmsOptions}
          selected={needsCMS}
          onChange={(val: string) => setValue('needsCMS', val, { shouldValidate: true })}
          showMoreCount={8}
        />
        {errors.needsCMS && (
          <p className="mt-2 text-xs text-error flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-error" />
            {errors.needsCMS.message}
          </p>
        )}
      </div>
    </div>
  );
}
