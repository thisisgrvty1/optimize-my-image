import React from 'react';

export const CookieIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
    <path d="M8.5 8.5v.01"></path>
    <path d="M16 15.5v.01"></path>
    <path d="M12 12v.01"></path>
    <path d="M15.5 16v.01"></path>
    <path d="M15.5 12v.01"></path>
  </svg>
);
