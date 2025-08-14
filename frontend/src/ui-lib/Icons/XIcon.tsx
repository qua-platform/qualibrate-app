import React from "react";

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg width="7" height="8" viewBox="0 0 7 8" fill="none" className={className} cursor={"pointer"}>
    <path opacity="0.8" fillRule="evenodd" clipRule="evenodd" d="M7 1.2L6.3 0.5L3.5 3.3L0.7 0.5L0 1.2L2.8 4L0 6.8L0.7 7.5L3.5 4.7L6.3 7.5L7 6.8L4.2 4L7 1.2Z" fill="var(--active-text)" />
  </svg>
);
    
export default XIcon;
    