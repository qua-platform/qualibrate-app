import React from "react";

interface PlusSignSquareIconProps {
  width?: number;
  height?: number;
  className?: string;
}

const PlusSignSquareIcon: React.FC<PlusSignSquareIconProps> = ({ width = 26, height = 26, className }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" className={className}>
      <rect x="1" y="1" width="30" height="30" rx="6" stroke="var(--active-text)" strokeWidth="2" />
      <path d="M16 10V22" stroke="var(--active-text)" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 16H22" stroke="var(--active-text)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export default PlusSignSquareIcon;
