
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-card-light dark:bg-card-dark rounded-3xl border border-border-light dark:border-border-dark shadow-xl-theme overflow-hidden p-6 sm:p-8 border-t-8 border-primary-light dark:border-primary-dark ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;