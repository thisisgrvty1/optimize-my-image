
import React from 'react';

export const RenameIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M15 4l-8 8v4h4l8-8-4-4z"></path>
    <path d="M20 5l-4-4"></path>
    <path d="M9 11l-5 5"></path>
    <path d="M9 15h4"></path>
  </svg>
);
