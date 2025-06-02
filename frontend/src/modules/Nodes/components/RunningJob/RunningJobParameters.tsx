import React from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./RunningJob.module.scss";
import { useNodesContext } from "../../context/NodesContext";
import Tooltip from "@mui/material/Tooltip";
import EllipsesIcon from "../../../../ui-lib/Icons/EllipsesIcon";

export const RunningJobParameters: React.FC<{ isExpanded: boolean }> = ({ isExpanded }) => {
  const { runningNode } = useNodesContext();
  return (
    <div className={styles.parametersWrapper} data-testid="parameters-wrapper">
      {/*{Object.entries(runningNode?.parameters ?? {}).length > 0 && (*/}
      <div className={styles.parameterTitleWrapper} data-testid="parameter-title">
        Parameters
        {!isExpanded && (
          <Tooltip
            title={
              <div className={styles.expandedTooltip}>
                {Object.entries(runningNode?.parameters ?? {}).map(([key, parameter]) => (
                  <div key={key}>
                    <strong>{parameter.title}:</strong> {parameter.default?.toString()}
                  </div>
                ))}
              </div>
            }
            placement="bottom-start"
          >
            <span className={styles.tooltipIcon}> &nbsp; <EllipsesIcon /> </span>
          </Tooltip>
        )}
      </div>
      {isExpanded && (
        <div data-testid="parameters-list">
          {Object.entries(runningNode?.parameters ?? {}).map(([key, parameter]) => (
            <div key={key} className={styles.parameterValues} data-testid={`parameter-item-${key}`}>
              <div className={styles.parameterLabel} data-testid={`parameter-label-${key}`}>
                {parameter.title}:
              </div>
              <div className={styles.parameterValue} data-testid={`parameter-value-${key}`}>
                {parameter.default?.toString()}
              </div>
            </div>
          ))}
        </div>
      )}
      {/*)}*/}
    </div>
  );
};
