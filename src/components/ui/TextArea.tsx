import type { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export default function TextArea({ label, error, id, ...props }: TextAreaProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block text-xs sm:text-sm font-body font-semibold text-text-secondary mb-2 uppercase tracking-wide"
      >
        {label}
      </label>
      <textarea
        id={inputId}
        className={`
          w-full min-h-[120px] px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg
          bg-surface-card border font-body text-text-primary text-xs sm:text-sm
          placeholder:text-text-muted
          transition-colors duration-150 resize-y
          focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand
          ${error ? 'border-error' : 'border-surface-border'}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-error flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-error" />
          {error}
        </p>
      )}
    </div>
  );
}
