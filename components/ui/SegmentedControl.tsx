import React from 'react';

interface SegmentedControlOption {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, value, onChange }) => {
  const activeIndex = options.findIndex(opt => opt.value === value);

  return (
    <div className="relative flex w-full max-w-xs p-1 bg-gray-200 dark:bg-gray-700 rounded-full">
      <span
        className="absolute top-1 left-1 bottom-1 bg-card-light dark:bg-card-dark rounded-full shadow-lg-theme transition-transform duration-300 ease-in-out"
        style={{
          width: `calc((100% - 0.25rem) / ${options.length})`,
          transform: `translateX(calc(${activeIndex} * 100% + ${activeIndex * 0.25}rem))`,
        }}
        aria-hidden="true"
      />
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`relative z-10 w-full py-2 text-sm font-bold rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background-dark
                      ${value === option.value
                        ? 'text-primary-light dark:text-primary-dark'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                      }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;