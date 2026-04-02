import type { UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import type { BriefFormData } from '../types/brief';
import RadioChipGroup from '../components/ui/RadioChipGroup';

const TIMELINE_OPTIONS = [
  'ASAP (under 2 weeks)',
  '1 month',
  '2–3 months',
  'No hard deadline',
];

const BUDGET_OPTIONS = [
  'Under 30,000 KES',
  '30,000–60,000 KES',
  '60,000–120,000 KES',
  '120,000–250,000 KES',
  '250,000+ KES',
  'Not sure yet',
];

interface StepProps {
  setValue: UseFormSetValue<BriefFormData>;
  watch: UseFormWatch<BriefFormData>;
  errors: FieldErrors<BriefFormData>;
}

export default function Step6_Timeline({ setValue, watch, errors }: StepProps) {
  const timeline = watch('timeline') || '';
  const budgetRange = watch('budgetRange') || '';

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="font-display text-xl sm:text-2xl mb-2 font-bold">Timeline & budget</h2>
        <p className="text-xs sm:text-sm text-text-secondary mb-4 sm:mb-5 leading-relaxed">
          When do you need it, and what's your budget?
        </p>
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-body font-semibold text-text-secondary mb-3 uppercase tracking-wide">
          Ideal timeline
        </label>
        <RadioChipGroup
          options={TIMELINE_OPTIONS}
          selected={timeline}
          onChange={(val) => setValue('timeline', val, { shouldValidate: true })}
        />
        {errors.timeline && (
          <p className="mt-2 text-xs text-error flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-error" />
            {errors.timeline.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-body font-semibold text-text-secondary mb-3 uppercase tracking-wide">
          Budget range
        </label>
        <RadioChipGroup
          options={BUDGET_OPTIONS}
          selected={budgetRange}
          onChange={(val) => setValue('budgetRange', val, { shouldValidate: true })}
        />
        {errors.budgetRange && (
          <p className="mt-2 text-xs text-error flex items-center gap-1">
            <span className="inline-block w-1 h-1 rounded-full bg-error" />
            {errors.budgetRange.message}
          </p>
        )}
      </div>
    </div>
  );
}
