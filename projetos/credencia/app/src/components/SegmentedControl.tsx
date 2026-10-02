interface SegmentedControlProps<T extends string> {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
  label: string;
}

export function SegmentedControl<T extends string>({ value, options, onChange, label }: SegmentedControlProps<T>) {
  return (
    <div
      className="inline-grid rounded-lg border border-line bg-panel/75 p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(86px, 1fr))` }}
      aria-label={label}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`min-h-10 whitespace-nowrap rounded-md px-3 text-center text-xs font-medium transition ${
            value === option.value
              ? "nav-active"
              : "text-muted hover:bg-panelStrong"
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
