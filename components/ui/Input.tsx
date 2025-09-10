import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ id, label, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`block w-full px-4 py-2 bg-white dark:bg-card-dark border-2 border-border-light dark:border-border-dark rounded-full shadow-inner placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark focus-visible:shadow-lg-theme sm:text-sm transition-all duration-200 ease-in-out-quad ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;