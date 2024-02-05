import { IconProps } from "../../DEPRECATED_common/DEPRECATED_interfaces/IconProps";
import { MENU_TEXT_COLOR } from "../../utils/colors";
import React from "react";

export const CodeBracketsIcon: React.FunctionComponent<IconProps> = ({ width = 24, height = 18, color = MENU_TEXT_COLOR }) => (
  <svg width={width} height={height} viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.6">
      <path
        d="M8 18H7.19456C5.7941 18 4.75283 17.7061 4.07075 17.1184C3.38866 16.5371 3.04762 15.6523 3.04762 14.4639V11.1313C3.04762 10.8149 3.00771 10.5339 2.92789 10.2885C2.84807 10.0366 2.70658 9.8267 2.5034 9.65877C2.30748 9.48439 2.04263 9.35199 1.70884 9.26157C1.38231 9.17115 0.968708 9.12594 0.468027 9.12594H0V7.77933H0.468027C0.997732 7.77933 1.42948 7.74058 1.76327 7.66308C2.09705 7.58558 2.35828 7.46932 2.54694 7.31432C2.7356 7.15285 2.86621 6.94941 2.93878 6.70398C3.01134 6.45856 3.04762 6.16792 3.04762 5.83208V3.53606C3.04762 2.99354 3.12018 2.50592 3.26531 2.0732C3.41043 1.63402 3.64626 1.26265 3.97279 0.959096C4.30658 0.649085 4.73469 0.413348 5.25714 0.251884C5.78685 0.0839613 6.43265 0 7.19456 0H8V1.3563H7.35782C5.67438 1.3563 4.83265 2.08288 4.83265 3.53606V5.79333C4.83265 7.36921 4.06712 8.25727 2.53605 8.45748C4.08163 8.59311 4.85442 9.47793 4.85442 11.1119V14.4252C4.85442 15.9042 5.68889 16.6437 7.35782 16.6437H8V18Z"
        fill={color}
      />
      <rect x="11" y="8" width="2" height="7" fill={color} />
      <rect x="11" y="3" width="2" height="2" fill={color} />
      <path
        d="M16 18H16.8054C18.2059 18 19.2472 17.7061 19.9293 17.1184C20.6113 16.5371 20.9524 15.6523 20.9524 14.4639V11.1313C20.9524 10.8149 20.9923 10.5339 21.0721 10.2885C21.1519 10.0366 21.2934 9.8267 21.4966 9.65877C21.6925 9.48439 21.9574 9.35199 22.2912 9.26157C22.6177 9.17115 23.0313 9.12594 23.532 9.12594H24V7.77933H23.532C23.0023 7.77933 22.5705 7.74058 22.2367 7.66308C21.9029 7.58558 21.6417 7.46932 21.4531 7.31432C21.2644 7.15285 21.1338 6.94941 21.0612 6.70398C20.9887 6.45856 20.9524 6.16792 20.9524 5.83208V3.53606C20.9524 2.99354 20.8798 2.50592 20.7347 2.0732C20.5896 1.63402 20.3537 1.26265 20.0272 0.959096C19.6934 0.649085 19.2653 0.413348 18.7429 0.251884C18.2132 0.0839613 17.5673 0 16.8054 0H16V1.3563H16.6422C18.3256 1.3563 19.1673 2.08288 19.1673 3.53606V5.79333C19.1673 7.36921 19.9329 8.25727 21.4639 8.45748C19.9184 8.59311 19.1456 9.47793 19.1456 11.1119V14.4252C19.1456 15.9042 18.3111 16.6437 16.6422 16.6437H16V18Z"
        fill={color}
      />
    </g>
  </svg>
);
