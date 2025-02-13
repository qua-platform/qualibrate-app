import React from "react";
import { IconProps } from "../../common/interfaces/IconProps";

export const CollapsedComponentIcon: React.FunctionComponent<IconProps> = ({ width = 18, height = 18 }) => (
  <svg width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: "none" }}>
    <circle cx="9" cy="9" r="8.5" stroke="#4E5058" />
    <circle cx="13" cy="9" r="1" transform="rotate(90 13 9)" fill="#A5ACB6" />
    <circle cx="9" cy="9" r="1" transform="rotate(90 9 9)" fill="#A5ACB6" />
    <circle cx="5" cy="9" r="1" transform="rotate(90 5 9)" fill="#A5ACB6" />
  </svg>
);
