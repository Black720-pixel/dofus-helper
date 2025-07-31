import React from 'react';

const SkullIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M12 2a9 9 0 0 1 9 9v3.66a2 2 0 0 1-1 1.73l-7 4.34a2 2 0 0 1-2 0l-7-4.34a2 2 0 0 1-1-1.73V11a9 9 0 0 1 9-9z"></path>
    <path d="M9 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
    <path d="M17 10a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
    <path d="M12 14a2 2 0 0 0-2 2h4a2 2 0 0 0-2-2z"></path>
    <path d="M12 18v2"></path>
  </svg>
);

export default SkullIcon;