import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        {/* Decorative accent line */}
        <div className="w-12 h-[2px] bg-brand mx-auto mb-8" />

        <h1 className="font-display font-bold text-text-primary mb-6 leading-tight">
          Tell us what you need.
          <br />
          <span className="text-brand">We'll tell you what it costs.</span>
        </h1>

        <p className="text-text-secondary font-body text-lg mb-10 max-w-md mx-auto">
          Fill out a short brief about your website project. We'll review it and
          get back to you with a tailored quote.
        </p>

        <button
          type="button"
          onClick={() => navigate('/brief')}
          className="
            inline-flex items-center gap-2 px-8 py-4
            bg-brand text-surface font-body font-medium text-base
            rounded-lg cursor-pointer
            transition-all duration-200
            hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/20
            active:scale-[0.98]
          "
        >
          Start Your Brief
          <span className="text-lg">→</span>
        </button>

        <p className="mt-6 text-sm text-text-muted">
          Takes about 4 minutes
        </p>
      </div>
    </div>
  );
}
