
import React from 'react';

const Slider: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => {
  return (
    <input
      type="range"
      aria-valuetext={`${props.value}%`}
      className={`w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer 
                 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-primary-light [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[var(--shadow-theme-lg)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-card-light dark:[&::-webkit-slider-thumb]:border-card-dark
                 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-primary-light [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-[var(--shadow-theme-lg)]
                 ${className}`}
      {...props}
    />
  );
};

export default Slider;