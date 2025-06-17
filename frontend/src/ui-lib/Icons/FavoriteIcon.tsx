import React from "react";

interface FavoriteIconProps {
  className?: string;
  width?: number;
  height?: number;
}

const FavoriteIcon: React.FC<FavoriteIconProps> = ({
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
      {/* Background circle */}
      <circle cx="19" cy="19" r="18.5" fill="#1F2024" stroke="#42424C" />

      {/* Star icon centered (38 - 20) / 2 = 9px offset */}
      <g transform="translate(9, 9)">
        <path
          d="M9.53423 2.19322C9.69983 1.76898 10.3002 1.76897 10.4658 2.19322L12.1687 6.55579C12.2398 6.73784 12.4104 6.8618 12.6055 6.87313L17.2808 7.1446C17.7354 7.171 17.9209 7.74195 17.5686 8.03055L13.9458 10.9982C13.7946 11.1221 13.7294 11.3226 13.779 11.5117L14.9655 16.042C15.0809 16.4826 14.5952 16.8355 14.2119 16.5896L10.27 14.0612C10.1054 13.9556 9.89455 13.9556 9.73005 14.0612L5.78811 16.5896C5.40477 16.8355 4.91908 16.4826 5.03447 16.042L6.22103 11.5117C6.27055 11.3226 6.20538 11.1221 6.0542 10.9982L2.43138 8.03055C2.07907 7.74195 2.26459 7.171 2.71925 7.1446L7.39452 6.87313C7.58962 6.8618 7.76025 6.73784 7.83131 6.55579L9.53423 2.19322Z"
          fill="#A5ACB6"
        />
      </g>
    </svg>
  );
};

export default FavoriteIcon;
