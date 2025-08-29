
import React from 'react';

export const CompressIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M14 10H2V2h8l4 4V2Z"></path>
    <path d="M22 12v8h-8l-4-4h4V4h8v8Z"></path>
    <path d="m14 10 8 8"></path>
    <path d="m8 16-6-6"></path>
  </svg>
);
