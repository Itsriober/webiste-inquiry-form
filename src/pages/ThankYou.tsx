import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import type { BriefFormData } from '../types/brief';

export default function ThankYou() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = (location.state as { data?: BriefFormData })?.data;

  // Guard: redirect if no submission data
  if (!data) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-lg text-center">
        {/* Success indicator */}
        <div className="w-16 h-16 rounded-full border-2 border-success flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-8 h-8 text-success"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="font-display font-bold text-text-primary mb-4">
          Brief received
        </h1>

        <p className="text-text-secondary font-body mb-8">
          Thank you, {data.clientName}. We'll review your brief and get back to
          you within <span className="text-text-primary font-medium">1 business day</span>.
        </p>

        {/* Summary card */}
        <div className="bg-surface-card border border-surface-border rounded-lg p-6 text-left mb-8">
          <h3 className="font-display text-lg mb-4 text-text-primary">
            Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Business type</span>
              <span className="text-text-primary">{data.businessType}</span>
            </div>
            <div className="h-px bg-surface-border" />
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Timeline</span>
              <span className="text-brand font-medium">{data.timeline}</span>
            </div>
            <div className="h-px bg-surface-border" />
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Budget</span>
              <span className="text-brand font-medium">{data.budgetRange}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="
            px-6 py-3 text-sm font-body text-text-secondary
            border border-surface-border rounded-lg cursor-pointer
            transition-colors duration-150
            hover:border-text-muted hover:text-text-primary
          "
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
