import React from "react";

interface EllipsesIconProps {
  width?: number;
  height?: number;
  strokeColor?: string;
  fillColor?: string;
}

const EllipsesIcon: React.FC<EllipsesIconProps> = ({
  width = 18,
  height = 18,
  strokeColor = "#4E5058",
  fillColor = "#A5ACB6",
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8.5" stroke={strokeColor} />
      <circle cx="13" cy="9" r="1" transform="rotate(90 13 9)" fill={fillColor} />
      <circle cx="9" cy="9" r="1" transform="rotate(90 9 9)" fill={fillColor} />
      <circle cx="5" cy="9" r="1" transform="rotate(90 5 9)" fill={fillColor} />
    </svg>
  );
};

export default EllipsesIcon;
