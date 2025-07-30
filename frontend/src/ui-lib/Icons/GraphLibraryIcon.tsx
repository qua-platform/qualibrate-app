import React from "react";

const GraphLibraryIcon: React.FC<{ width?: number; height?: number; className?: string }> = ({
  width = 25,
  height = 24,
  className,
}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 25 24"
      fill="none"
    >
      <g clipPath="url(#clip0)">
        <circle cx="20.5" cy="19.5" r="3.5" stroke="#ffffff" strokeWidth="1.2" />
        <circle cx="13" cy="12" r="3.5" stroke="#ffffff" strokeWidth="1.2" />
        <circle cx="4.5" cy="4.5" r="3.5" stroke="#ffffff" strokeWidth="1.2" />
        <path d="M7 7L10.5 10" stroke="#ffffff" strokeWidth="1.5" />
        <path d="M15.5 14L18.5 17" stroke="#ffffff" strokeWidth="1.5" />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="25" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default GraphLibraryIcon;