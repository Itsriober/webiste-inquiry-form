import Chip from './Chip';

interface RadioChipGroupProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  otherValue?: string;
  onOtherChange?: (val: string) => void;
}

export default function RadioChipGroup({
  options,
  selected,
  onChange,
  otherValue,
  onOtherChange,
}: RadioChipGroupProps) {
  const hasOtherSelected = selected === 'Other';

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            selected={selected === option}
            onClick={() => onChange(option)}
          />
        ))}
      </div>
      {hasOtherSelected && onOtherChange !== undefined && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
          <input
            type="text"
            placeholder="Please specify..."
            value={otherValue || ''}
            onChange={(e) => onOtherChange(e.target.value)}
            className="w-full bg-surface-card border border-surface-border text-text-primary rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all placeholder:text-text-muted"
          />
        </div>
      )}
    </div>
  );
}
