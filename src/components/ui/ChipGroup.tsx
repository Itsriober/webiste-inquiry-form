import Chip from './Chip';

interface ChipGroupProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  exclusiveOption?: string; // e.g. "None of the above"
  otherValue?: string;
  onOtherChange?: (val: string) => void;
}

export default function ChipGroup({
  options,
  selected,
  onChange,
  exclusiveOption,
  otherValue,
  onOtherChange,
}: ChipGroupProps) {
  const toggle = (value: string) => {
    if (exclusiveOption) {
      if (value === exclusiveOption) {
        // Selecting exclusive clears all others
        onChange(selected.includes(value) ? [] : [value]);
        // Also clear 'Other' string if 'None of the above' is chosen
        if (onOtherChange && value === exclusiveOption && !selected.includes(value)) {
          onOtherChange('');
        }
        return;
      }
      // Selecting non-exclusive removes the exclusive option
      const withoutExclusive = selected.filter((v) => v !== exclusiveOption);
      const next = withoutExclusive.includes(value)
        ? withoutExclusive.filter((v) => v !== value)
        : [...withoutExclusive, value];
      onChange(next);
      return;
    }

    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange(next);
  };

  const hasOtherSelected = selected.includes('Other');

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            selected={selected.includes(option)}
            onClick={() => toggle(option)}
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
