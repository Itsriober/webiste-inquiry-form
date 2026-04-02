import type { UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import type { BriefFormData } from '../types/brief';
import ExpandableChipGroup from '../components/ui/ExpandableChipGroup';
import { pagesNeededOptions, contentSourceOptions } from '../data/options';

interface StepProps {
  setValue: UseFormSetValue<BriefFormData>;
  watch: UseFormWatch<BriefFormData>;
  errors: FieldErrors<BriefFormData>;
}

export default function Step3_Pages({ setValue, watch, errors }: StepProps) {
  const pagesNeeded = watch('pagesNeeded') || [];
  const pagesNeededOther = watch('pagesNeededOther') || '';
  const contentSource = watch('contentSource') || '';

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="font-display text-xl sm:text-2xl mb-2 font-bold">Pages & content</h2>
        <p className="text-xs sm:text-sm text-text-secondary mb-4 sm:mb-5 leading-relaxed">
          Which pages does your website need?
        </p>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-body font-semibold text-text-secondary mb-3 uppercase tracking-wide">
          Pages needed
        </label>
        <ExpandableChipGroup
          type="multi"
          options={pagesNeededOptions}
          selected={pagesNeeded}
          onChange={(val: string[]) => setValue('pagesNeeded', val, { shouldValidate: true })}
          otherValue={pagesNeededOther}
          onOtherChange={(val: string) => setValue('pagesNeededOther', val, { shouldValidate: true })}
          showMoreCount={8}
        />
        {errors.pagesNeeded && (
          <p className="mt-2 text-xs text-error flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-error" />
            {errors.pagesNeeded.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-body font-semibold text-text-secondary mb-3 uppercase tracking-wide">
          Content source
        </label>
        <ExpandableChipGroup
          type="single"
          options={contentSourceOptions}
          selected={contentSource}
          onChange={(val: string) => setValue('contentSource', val, { shouldValidate: true })}
          showMoreCount={8}
        />
        {errors.contentSource && (
          <p className="mt-2 text-xs text-error flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-error" />
            {errors.contentSource.message}
          </p>
        )}
      </div>
    </div>
  );
}
