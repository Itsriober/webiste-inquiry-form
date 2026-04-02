import { STEP_TITLES } from '../../types/brief';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const title = STEP_TITLES[current] || '';

  return (
    <div className="w-full mb-6 sm:mb-8">
      <div className="flex justify-between items-baseline mb-2 sm:mb-3 gap-4">
        <span className="text-xs sm:text-sm font-body font-semibold text-text-secondary uppercase tracking-wider">
          Step {current} of {total}
        </span>
        <span className="text-xs sm:text-sm font-body text-text-muted text-right">{title}</span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={`
              h-[3px] flex-1 rounded-full transition-colors duration-300
              ${i < current ? 'bg-brand' : 'bg-surface-border'}
            `}
          />
        ))}
      </div>
    </div>
  );
}
