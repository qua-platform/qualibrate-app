import React from "react";

interface CalandarProjectIconProps {
  className?: string;
  width?: number;
  height?: number;
}

const CalandarProjectIcon: React.FC<CalandarProjectIconProps> = ({
  className,
  width = 38,
  height = 38,
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 38 38"
      fill="none"
    >
      {/* Outer circle */}
      <circle cx="19" cy="19" r="18.5" fill="#1F2024" stroke="#42424C" />

      {/* Calendar icon (16x16 centered in 38x38) */}
      <g transform="translate(11,11)">
        <path
          d="M1 7H15V13C15 14.1046 14.1046 15 13 15H3C1.89543 15 1 14.1046 1 13V7Z"
          fill="#A5ACB6"
        />
        <path
          d="M1 5.5H15V4.5C15 3.39543 14.1046 2.5 13 2.5H3C1.89543 2.5 1 3.39543 1 4.5V5.5Z"
          fill="#A5ACB6"
        />
        <rect x="4.6" y="1" width="1.4" height="4" rx="0.7" fill="#A5ACB6" />
        <rect x="10" y="1" width="1.4" height="4" rx="0.7" fill="#A5ACB6" />
      </g>
    </svg>
  );
};

export default CalandarProjectIcon;
