import React, { useState } from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./RunningJob.module.scss";
import { useNodesContext } from "../../context/NodesContext";
import EllipsesIcon from "../../../../ui-lib/Icons/EllipsesIcon";
import Popper from "@mui/material/Popper";

export const ParameterPreview: React.FC = () => {
  const { runningNode } = useNodesContext();
  return (
    <div className={styles.parameterContent} data-testid="parameters-list">
      {Object.entries(runningNode?.parameters ?? {}).map(([key, parameter]) => (
        <div key={key} className={styles.parameterValues} data-testid={`parameter-item-${key}`}>
          <div className={styles.parameterLabel} data-testid={`parameter-label-${key}`}> {parameter.title}:</div>
          <div className={styles.parameterValue} data-testid={`parameter-value-${key}`}> {parameter.default?.toString()}</div>
        </div>
      ))}
    </div>
  );
};

export const RunningJobParameters: React.FC<{ isExpanded: boolean }> = ({ isExpanded }) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  let timer: NodeJS.Timeout | null = null;

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (timer) clearTimeout(timer);
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timer = setTimeout(() => setOpen(false), 100);
  };

  return (
    <div className={styles.parametersWrapper} data-testid="parameters-wrapper">
      {/*{Object.entries(runningNode?.parameters ?? {}).length > 0 && (*/}
      <div className={styles.parameterTitleWrapper} data-testid="parameter-title"> Parameters
        {!isExpanded && (
          <span className={styles.tooltipWrapper} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
            <span className={styles.tooltipIcon}> &nbsp;<EllipsesIcon /> </span>
            <Popper
              open={open}
              anchorEl={anchorEl}
              placement="bottom-start"
              disablePortal
              transition={false}
              modifiers={[{ name: "offset", options: { offset: [0, 10] } }]}
              style={{ zIndex: 9999 }}
            >
              <div className={styles.parameterTooltipBox}> <ParameterPreview /> </div>
            </Popper>
          </span>
        )}
      </div>
      {/*)}*/}
      {isExpanded && <ParameterPreview />}
    </div>
  );
};
