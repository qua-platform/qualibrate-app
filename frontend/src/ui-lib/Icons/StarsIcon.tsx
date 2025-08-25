import React from "react";
import { IconProps } from "../../common/interfaces/IconProps";

const ExtensionsIcon: React.FC<IconProps> = ({ color = "#A5ACB6", width = 24, height = 24 }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
        fill={color}
      />
      <path
        d="M19 15L19.5 17L22 17.5L19.5 18L19 20L18.5 18L16 17.5L18.5 17L19 15Z"
        fill={color}
      />
      <path
        d="M5 15L5.5 17L8 17.5L5.5 18L5 20L4.5 18L2 17.5L4.5 17L5 15Z"
        fill={color}
      />
    </svg>
  );
};

export default ExtensionsIcon;
