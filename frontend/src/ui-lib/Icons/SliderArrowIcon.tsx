import React from "react";
import { IconProps } from "../../common/interfaces/IconProps";

export const SliderArrowIcon: React.FunctionComponent<IconProps> = ({ width = 20, height = 7 }) => (
  <svg width={width} height={height} viewBox="0 0 20 7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.5702 7L9.99998 1.70083L2.42973 7H0L9.99998 1.66893e-05L20 7H17.5702Z"
      fill="#A5ACB6"
    />
  </svg>
);
