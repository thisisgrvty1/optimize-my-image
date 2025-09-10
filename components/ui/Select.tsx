import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ children, className = '', ...props }) => {
  return (
    <select
      className={`block w-full pl-4 pr-10 py-2 text-base bg-white dark:bg-card-dark border-2 border-border-light dark:border-border-dark focus:outline-none focus-visible:border-primary-light dark:focus-visible:border-primary-dark focus-visible:shadow-lg-theme sm:text-sm rounded-full shadow-inner transition-all duration-200 ease-in-out-quad ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;