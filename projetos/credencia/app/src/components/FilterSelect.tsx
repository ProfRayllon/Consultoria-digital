interface FilterSelectProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}

export function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className="grid grid-cols-1 min-w-[150px] gap-1.5">
      <span className="field-label">{label}</span>
      <select
        className="focus-ring h-9 rounded-lg border border-line bg-panel/75 px-3 text-sm font-normal text-ink"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
