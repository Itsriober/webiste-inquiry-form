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
        cursor-pointer rounded-full px-4 py-2 text-sm font-body
        transition-all duration-150 select-none
        ${
          selected
            ? 'border border-brand bg-brand-subtle text-brand'
            : 'border border-surface-border text-text-secondary hover:border-brand/50 hover:text-text-primary'
        }
      `}
    >
      {label}
    </button>
  );
}
