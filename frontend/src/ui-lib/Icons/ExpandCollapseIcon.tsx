import React from "react";

interface ExpandCollapseIconProps {
  direction: "up" | "down";
  width?: number;
  height?: number;
  fill?: string;
}

const ExpandCollapseIcon: React.FC<ExpandCollapseIconProps> = ({
  direction,
  width = 20,
  height = 7,
  fill = "#A5ACB6",
}) => {
  const pathD =
    direction === "up"
      ? "M17.5702 7L9.99998 1.70083L2.42973 7H0L9.99998 1.66893e-05L20 7H17.5702Z"
      : "M17.5702 0L9.99998 5.29917L2.42973 0H0L9.99998 6.99998L20 0H17.5702Z";

  return (
    <svg width={width} height={height} viewBox="0 0 20 7" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d={pathD} fill={fill} />
    </svg>
  );
};

export default ExpandCollapseIcon;
