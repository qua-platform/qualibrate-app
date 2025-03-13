import React from "react";

const CheckmarkIcon: React.FC<{ width?: number; height?: number; color?: string, className?: string }> = ({
  width = 30,
  height = 30,
  color = "#78e08f",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16" cy="16" r="12" stroke={color} strokeWidth="2.5" fill="none" />

      <path
        d="M10 16L14 20L22 12"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckmarkIcon;
