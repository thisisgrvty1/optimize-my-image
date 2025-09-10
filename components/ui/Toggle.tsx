import React from 'react';

interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
}

const Toggle: React.FC<ToggleProps> = ({ id, checked, disabled, ...props }) => {
  return (
    <label htmlFor={id} className={`relative inline-flex items-center flex-shrink-0 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input 
        type="checkbox" 
        id={id} 
        className="sr-only peer" 
        checked={checked} 
        disabled={disabled}
        {...props} 
      />
      <div className="w-14 h-8 bg-gray-200 dark:bg-gray-700 rounded-full peer 
                      peer-focus:outline-none peer-focus-visible:ring-4 peer-focus-visible:ring-primary-light/50 dark:peer-focus-visible:ring-primary-dark/50
                      peer-checked:bg-primary-light dark:peer-checked:bg-primary-dark
                      after:content-[''] after:absolute after:top-1 after:left-1
                      after:bg-card-light after:rounded-full after:h-6 after:w-6 
                      after:transition-all peer-checked:after:translate-x-full">
      </div>
    </label>
  );
};

export default Toggle;