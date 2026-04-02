import type { UseFormSetValue, UseFormWatch, UseFormRegister, FieldErrors } from 'react-hook-form';
import type { BriefFormData } from '../types/brief';
import RadioChipGroup from '../components/ui/RadioChipGroup';
import TextArea from '../components/ui/TextArea';

const BRAND_STATUS_OPTIONS = [
  'Full brand guidelines',
  'Logo only',
  'Partial elements',
  'No — needs branding too',
];

const STYLE_OPTIONS = [
  'Clean / minimal',
  'Bold / modern',
  'Corporate / formal',
  'Warm / friendly',
  'Creative / artistic',
];

interface StepProps {
  setValue: UseFormSetValue<BriefFormData>;
  watch: UseFormWatch<BriefFormData>;
  register: UseFormRegister<BriefFormData>;
  errors: FieldErrors<BriefFormData>;
}

export default function Step5_Design({ setValue, watch, register, errors }: StepProps) {
  const brandStatus = watch('brandStatus') || '';
  const designStyle = watch('designStyle') || '';

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="font-display text-xl sm:text-2xl mb-2 font-bold">Design preferences</h2>
        <p className="text-xs sm:text-sm text-text-secondary mb-4 sm:mb-5 leading-relaxed">
          Help us understand your visual direction.
        </p>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-body font-semibold text-text-secondary mb-3 uppercase tracking-wide">
          Current brand status
        </label>
        <RadioChipGroup
          options={BRAND_STATUS_OPTIONS}
          selected={brandStatus}
          onChange={(val) => setValue('brandStatus', val, { shouldValidate: true })}
        />
        {errors.brandStatus && (
          <p className="mt-2 text-xs text-error flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-error" />
            {errors.brandStatus.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-body font-semibold text-text-secondary mb-3 uppercase tracking-wide">
          Preferred style
        </label>
        <RadioChipGroup
          options={STYLE_OPTIONS}
          selected={designStyle}
          onChange={(val) => setValue('designStyle', val, { shouldValidate: true })}
        />
        {errors.designStyle && (
          <p className="mt-2 text-xs text-error flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-error" />
            {errors.designStyle.message}
          </p>
        )}
      </div>

      <TextArea
        label="Reference URLs (optional)"
        placeholder="e.g. https://example.com — paste any websites you like"
        {...register('referenceUrls')}
      />
    </div>
  );
}
