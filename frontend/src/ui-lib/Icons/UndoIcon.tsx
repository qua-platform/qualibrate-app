import { IconProps } from "../../common/interfaces/IconProps";
import React from "react";

export const UndoIcon: React.FunctionComponent<IconProps> = ({ width = 17, height = 17 }) => (
  <svg width={width} height={height} viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.38412 2.41501C5.59241 2.62328 5.59241 2.96097 5.38412 3.16924L4.16125 4.39212H9.807C12.458 4.39212 14.607 6.54116 14.607 9.19212C14.607 11.8431 12.458 13.9921 9.807 13.9921H5.54033C5.24579 13.9921 5.007 13.7533 5.007 13.4588C5.007 13.1643 5.24579 12.9255 5.54033 12.9255H9.807C11.8689 12.9255 13.5403 11.254 13.5403 9.19212C13.5403 7.13026 11.8689 5.45879 9.807 5.45879H4.16125L5.38412 6.68167C5.59241 6.88995 5.59241 7.22763 5.38412 7.43591C5.17584 7.6442 4.83816 7.6442 4.62988 7.43591L2.49655 5.30258C2.28826 5.0943 2.28826 4.75662 2.49655 4.54834L4.62988 2.41501C4.83816 2.20672 5.17584 2.20672 5.38412 2.41501Z"
      fill="#3CDEF8"
    />
  </svg>
);
