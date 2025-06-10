import React from "react";

interface ProjectCheckIconProps {
  className?: string;
  width?: number;
  height?: number;
  stroke?: string;
}

const ProjectCheckIcon: React.FC<ProjectCheckIconProps> = ({
  className,
  width = 19,
  height = 12,
  stroke = "#A5ACB6",
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 21 14"
      fill="none"
    >
      <path
        d="M1 8.2L6.42857 13L20 1"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ProjectCheckIcon;
