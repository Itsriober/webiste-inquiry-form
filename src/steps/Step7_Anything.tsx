import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { BriefFormData } from '../types/brief';
import TextArea from '../components/ui/TextArea';

interface StepProps {
  register: UseFormRegister<BriefFormData>;
  errors: FieldErrors<BriefFormData>;
}

export default function Step7_Anything({ register, errors }: StepProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="font-display text-xl sm:text-2xl mb-2 font-bold">Almost done</h2>
        <p className="text-xs sm:text-sm text-text-secondary mb-4 sm:mb-5 leading-relaxed">
          Anything else you'd like us to know? Then leave your details so we can get back to you.
        </p>
      </div>

      <TextArea
        label="Additional notes (optional)"
        placeholder="Any extra details, special requirements, or ideas..."
        {...register('additionalNotes')}
      />

      {/* Visual separator */}
      <div className="border-t border-surface-border pt-6 sm:pt-8">
        <h3 className="font-display text-lg sm:text-xl mb-4 sm:mb-6 font-bold">Your details</h3>

        <div className="space-y-4 sm:space-y-5">
          <div>
            <label
              htmlFor="clientName"
              className="block text-xs sm:text-sm font-body font-semibold text-text-secondary mb-2 uppercase tracking-wide"
            >
              Name <span className="text-brand">*</span>
            </label>
            <input
              id="clientName"
              type="text"
              className={`
                w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-surface-card border font-body text-text-primary text-xs sm:text-sm
                placeholder:text-text-muted transition-colors duration-150
                focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand
                min-h-[44px] sm:min-h-auto
                ${errors.clientName ? 'border-error' : 'border-surface-border'}
              `}
              placeholder="Jane Doe"
              {...register('clientName')}
            />
            {errors.clientName && (
              <p className="mt-1.5 text-xs text-error flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-error" />
                {errors.clientName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="clientCompany"
              className="block text-xs sm:text-sm font-body font-semibold text-text-secondary mb-2 uppercase tracking-wide"
            >
              Company
            </label>
            <input
              id="clientCompany"
              type="text"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-surface-card border border-surface-border font-body text-text-primary text-xs sm:text-sm placeholder:text-text-muted transition-colors duration-150 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand min-h-[44px] sm:min-h-auto"
              placeholder="Acme Ltd"
              {...register('clientCompany')}
            />
          </div>

          <div>
            <label
              htmlFor="clientEmail"
              className="block text-xs sm:text-sm font-body font-semibold text-text-secondary mb-2 uppercase tracking-wide"
            >
              Email <span className="text-brand">*</span>
            </label>
            <input
              id="clientEmail"
              type="email"
              className={`
                w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-surface-card border font-body text-text-primary text-xs sm:text-sm
                placeholder:text-text-muted transition-colors duration-150
                focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand
                min-h-[44px] sm:min-h-auto
                ${errors.clientEmail ? 'border-error' : 'border-surface-border'}
              `}
              placeholder="jane@example.com"
              {...register('clientEmail')}
            />
            {errors.clientEmail && (
              <p className="mt-1.5 text-xs text-error flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-error" />
                {errors.clientEmail.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="clientPhone"
              className="block text-xs sm:text-sm font-body font-semibold text-text-secondary mb-2 uppercase tracking-wide"
            >
              Phone
            </label>
            <input
              id="clientPhone"
              type="tel"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-surface-card border border-surface-border font-body text-text-primary text-xs sm:text-sm placeholder:text-text-muted transition-colors duration-150 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand min-h-[44px] sm:min-h-auto"
              placeholder="+254 700 000 000"
              {...register('clientPhone')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
