import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { BriefFormData } from '../types/brief';
import TextArea from '../components/ui/TextArea';

interface StepProps {
  register: UseFormRegister<BriefFormData>;
  errors: FieldErrors<BriefFormData>;
}

export default function Step7_Anything({ register, errors }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl mb-2">Almost done</h2>
        <p className="text-sm text-text-secondary mb-5">
          Anything else you'd like us to know? Then leave your details so we can get back to you.
        </p>
      </div>

      <TextArea
        label="Additional notes (optional)"
        placeholder="Any extra details, special requirements, or ideas..."
        {...register('additionalNotes')}
      />

      {/* Visual separator */}
      <div className="border-t border-surface-border pt-8">
        <h3 className="font-display text-xl mb-6">Your details</h3>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="clientName"
              className="block text-sm font-body text-text-secondary mb-2"
            >
              Name <span className="text-brand">*</span>
            </label>
            <input
              id="clientName"
              type="text"
              className={`
                w-full px-4 py-3 rounded-lg bg-surface-card border font-body text-text-primary text-sm
                placeholder:text-text-muted transition-colors duration-150
                focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand
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
              className="block text-sm font-body text-text-secondary mb-2"
            >
              Company
            </label>
            <input
              id="clientCompany"
              type="text"
              className="w-full px-4 py-3 rounded-lg bg-surface-card border border-surface-border font-body text-text-primary text-sm placeholder:text-text-muted transition-colors duration-150 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              placeholder="Acme Ltd"
              {...register('clientCompany')}
            />
          </div>

          <div>
            <label
              htmlFor="clientEmail"
              className="block text-sm font-body text-text-secondary mb-2"
            >
              Email <span className="text-brand">*</span>
            </label>
            <input
              id="clientEmail"
              type="email"
              className={`
                w-full px-4 py-3 rounded-lg bg-surface-card border font-body text-text-primary text-sm
                placeholder:text-text-muted transition-colors duration-150
                focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand
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
              className="block text-sm font-body text-text-secondary mb-2"
            >
              Phone
            </label>
            <input
              id="clientPhone"
              type="tel"
              className="w-full px-4 py-3 rounded-lg bg-surface-card border border-surface-border font-body text-text-primary text-sm placeholder:text-text-muted transition-colors duration-150 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
              placeholder="+254 700 000 000"
              {...register('clientPhone')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
