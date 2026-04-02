interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        cursor-pointer rounded-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-body
        transition-all duration-150 select-none
        min-h-[44px] sm:min-h-auto flex items-center justify-center
        font-medium
        ${
          selected
            ? 'border border-brand bg-brand-subtle text-brand shadow-sm'
            : 'border border-surface-border text-text-secondary hover:border-brand/50 hover:text-text-primary hover:bg-surface-elevated/30'
        }
      `}
    >
      {label}
    </button>
  );
}
