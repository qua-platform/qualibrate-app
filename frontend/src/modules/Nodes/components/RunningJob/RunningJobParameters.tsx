import React, { useState } from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./RunningJob.module.scss";
import EllipsesIcon from "../../../../ui-lib/Icons/EllipsesIcon";
import Popper from "@mui/material/Popper";
import ParameterListPreview from "./ParameterListPreview";

export const RunningJobParameters: React.FC<{ isExpanded: boolean }> = ({ isExpanded }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  let timer: NodeJS.Timeout | null = null;

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (timer) clearTimeout(timer);
    setAnchorEl(event.currentTarget);
    setTooltipOpen(true);
  };

  const handleMouseLeave = () => {
    timer = setTimeout(() => setTooltipOpen(false), 100);
  };

  return (
    <div className={styles.parametersWrapper} data-testid="parameters-wrapper">
      {/*{Object.entries(runningNode?.parameters ?? {}).length > 0 && (*/}
      <div className={styles.parameterTitleWrapper} data-testid="parameter-title"> Parameters
        {!isExpanded && (
          <span className={styles.tooltipWrapper} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
            <span className={styles.tooltipIcon}> &nbsp;<EllipsesIcon /> </span>
            <Popper open={tooltipOpen} anchorEl={anchorEl} placement="bottom-start" disablePortal transition={false} modifiers={[{ name: "offset", options: { offset: [0, 10] } }]} style={{ zIndex: 9999 }} >
              <div className={styles.parameterTooltipBox}> <ParameterListPreview /> </div>
            </Popper>
          </span>
        )}
      </div>
      {/*)}*/}
      {isExpanded && <ParameterListPreview />}
    </div>
  );
};
