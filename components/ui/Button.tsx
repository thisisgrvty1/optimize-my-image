import React from 'react';
import { SpinnerIcon } from '../icons/SpinnerIcon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', variant = 'primary', isLoading = false, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background-dark transform transition-all duration-200 ease-in-out-quad hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100';

  const variantClasses = {
    primary: 'bg-primary-light dark:bg-primary-dark text-white hover:bg-primary-light-hover dark:hover:bg-primary-dark-hover focus-visible:ring-primary-light dark:focus-visible:ring-primary-dark shadow-lg-theme',
    secondary: 'bg-secondary-light dark:bg-secondary-dark text-white hover:bg-secondary-light-hover dark:hover:bg-secondary-dark-hover focus-visible:ring-secondary-light dark:focus-visible:ring-secondary-dark shadow-lg-theme',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-lg shadow-red-600/30',
    ghost: 'text-primary-light dark:text-primary-dark hover:bg-primary-light/10 dark:hover:bg-primary-dark/10 shadow-none px-4 py-2'
  };

  return (
    <button
      type="button"
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
            <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;