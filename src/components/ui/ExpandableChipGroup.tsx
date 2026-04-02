import { useState } from 'react';
import ChipGroup from './ChipGroup';
import RadioChipGroup from './RadioChipGroup';

interface ExpandableChipGroupProps {
  options: string[];
  selected: string[] | string;
  onChange: any;
  exclusiveOption?: string;
  otherValue?: string;
  onOtherChange?: (val: string) => void;
  showMoreCount: number;
  type?: 'multi' | 'single';
}

export default function ExpandableChipGroup({
  options,
  selected,
  onChange,
  exclusiveOption,
  otherValue,
  onOtherChange,
  showMoreCount,
  type = 'multi',
}: ExpandableChipGroupProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleOptions = expanded ? options : options.slice(0, showMoreCount);
  const hasMore = options.length > showMoreCount;

  return (
    <div className="space-y-3">
      {type === 'multi' ? (
        <ChipGroup
          options={visibleOptions}
          selected={selected as string[]}
          onChange={onChange}
          exclusiveOption={exclusiveOption}
          otherValue={otherValue}
          onOtherChange={onOtherChange}
        />
      ) : (
        <RadioChipGroup
          options={visibleOptions}
          selected={selected as string}
          onChange={onChange}
          otherValue={otherValue}
          onOtherChange={onOtherChange}
        />
      )}
      
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-sm font-medium text-brand hover:text-brand/80 transition-colors mt-2"
        >
          {expanded ? 'Show less' : 'Show more...'}
        </button>
      )}
    </div>
  );
}
