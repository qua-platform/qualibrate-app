import React from "react";

const RefreshButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        width: "26px",
        height: "26px",
        padding: "4px 0px",
        justifyContent: "center",
        alignItems: "center",
        gap: "1px",
        flexShrink: 0,
        borderRadius: "31px",
        border: "1px solid var(--border, #42424C)",
        background: "none",
        cursor: "pointer",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <mask id="mask0_4399_8326" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
          <rect width="20" height="20" fill="#C4C4C4"/>
        </mask>
        <g mask="url(#mask0_4399_8326)">
          <path d="M16.1767 10.1134C16.1761 9.12124 15.945 8.1846 15.5335 7.35099L14.2004 8.68414C14.3509 9.1331 14.4408 9.61141 14.4402 10.1103C14.4395 12.5999 12.4152 14.6243 9.92619 14.6243C7.4391 14.6224 5.41596 12.5993 5.41222 10.1103C5.41471 7.62136 7.43785 5.59822 9.92619 5.59635C9.93306 5.59572 9.9493 5.59947 9.95929 5.59822L9.96054 5.59947L9.96179 8.12104L13.6558 4.75564L9.96183 1.39028L9.96179 3.85982C9.94992 3.86294 9.93556 3.86357 9.92557 3.86232C6.47561 3.86169 3.67756 6.65975 3.67818 10.1097C3.67943 13.564 6.47561 16.3602 9.92932 16.3608C13.378 16.3602 16.178 13.564 16.1767 10.1134Z" fill="#A5ACB6"/>
        </g>
      </svg>
    </button>
  );
};

export default RefreshButton;
