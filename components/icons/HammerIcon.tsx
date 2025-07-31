import React from 'react';

const HammerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M15.5 22l-5-5" />
    <path d="M12 19l-7-7 5-5 7 7-5 5z" />
    <path d="M6.5 12.5l5 5" />
    <path d="m21.5 8.5-5-5" />
    <path d="m15 3 6 6" />
  </svg>
);

export default HammerIcon;