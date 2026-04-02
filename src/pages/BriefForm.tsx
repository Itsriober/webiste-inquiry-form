import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { BriefFormData } from '../types/brief';
import { briefFormSchema, STEP_FIELDS, type BriefFormSchema } from '../lib/formSchema';
import { useMultiStep } from '../hooks/useMultiStep';
import { saveBrief, recordStart } from '../lib/storage';
import { sendBriefEmail } from '../lib/emailjs';

import ProgressBar from '../components/ui/ProgressBar';
import StepWrapper from '../components/ui/StepWrapper';
import Step1_BusinessInfo from '../steps/Step1_BusinessInfo';
import Step2_Purpose from '../steps/Step2_Purpose';
import Step3_Pages from '../steps/Step3_Pages';
import Step4_Features from '../steps/Step4_Features';
import Step5_Design from '../steps/Step5_Design';
import Step6_Timeline from '../steps/Step6_Timeline';
import Step7_Anything from '../steps/Step7_Anything';

const TOTAL_STEPS = 7;

export default function BriefForm() {
  const navigate = useNavigate();
  const { currentStep, direction, next, back, isFirst, isLast } =
    useMultiStep(TOTAL_STEPS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    recordStart();
  }, []);

  const {
    register,
    setValue,
    watch,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<BriefFormData>({
    resolver: zodResolver(briefFormSchema),
    defaultValues: {
      businessType: '',
      hasExistingSite: '',
      websitePurpose: [],
      targetAudience: '',
      pagesNeeded: [],
      contentSource: '',
      featuresNeeded: [],
      needsCMS: '',
      brandStatus: '',
      designStyle: '',
      referenceUrls: '',
      timeline: '',
      budgetRange: '',
      additionalNotes: '',
      clientName: '',
      clientCompany: '',
      clientEmail: '',
      clientPhone: '',
    },
    mode: 'onTouched',
  });

  const handleNext = async () => {
    const fields = STEP_FIELDS[currentStep] as (keyof BriefFormSchema)[];
    const isValid = await trigger(fields);
    if (isValid) {
      next();
      setSubmitError(null);
    }
  };

  const onSubmit = async (data: BriefFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      saveBrief(data);
      await sendBriefEmail(data);
      navigate('/thank-you', { state: { data } });
    } catch {
      setSubmitError(
        'Something went wrong sending your brief. Please try again or contact us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const stepProps = { setValue, watch, errors };

    switch (currentStep) {
      case 1:
        return <Step1_BusinessInfo {...stepProps} />;
      case 2:
        return <Step2_Purpose {...stepProps} />;
      case 3:
        return <Step3_Pages {...stepProps} />;
      case 4:
        return <Step4_Features {...stepProps} />;
      case 5:
        return <Step5_Design {...stepProps} register={register} />;
      case 6:
        return <Step6_Timeline {...stepProps} />;
      case 7:
        return <Step7_Anything register={register} errors={errors} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <ProgressBar current={currentStep} total={TOTAL_STEPS} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <StepWrapper stepKey={currentStep} direction={direction}>
            {renderStep()}
          </StepWrapper>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-surface-border">
            {!isFirst ? (
              <button
                type="button"
                onClick={back}
                className="
                  px-6 py-3 text-sm font-body text-text-secondary
                  border border-surface-border rounded-lg cursor-pointer
                  transition-colors duration-150
                  hover:border-text-muted hover:text-text-primary
                "
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {isLast ? (
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  px-8 py-3 text-sm font-body font-medium
                  bg-brand text-surface rounded-lg cursor-pointer
                  transition-all duration-200
                  hover:bg-brand-dark
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center gap-2
                "
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Submitting…
                  </>
                ) : (
                  'Submit Brief'
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="
                  px-8 py-3 text-sm font-body font-medium
                  bg-brand text-surface rounded-lg cursor-pointer
                  transition-all duration-200
                  hover:bg-brand-dark
                "
              >
                Next →
              </button>
            )}
          </div>

          {/* Error banner */}
          {submitError && (
            <div className="mt-4 p-4 rounded-lg border border-error/30 bg-error/5">
              <p className="text-sm text-error flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-error" />
                {submitError}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
