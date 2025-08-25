import React from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./RunningJob.module.scss";
import { useNodesContext } from "../../context/NodesContext";
import { EmptyStateOverlay } from "../StateUpdates/EmptyStateOverlay";

export const RunningJobParameters: React.FC = () => {
  const { runningNode } = useNodesContext();
  return (
    <div className={styles.parametersWrapper} data-testid="parameters-wrapper">
      {Object.entries(runningNode?.parameters ?? {}).length > 0 && (
        <div className={styles.parameterTitleWrapper} data-testid="parameter-title">Parameters</div>
      )}
      {Object.entries(runningNode?.parameters ?? {}).length > 0 ? (
        <div data-testid="parameters-list">
          {Object.entries(runningNode?.parameters ?? {}).map(([key, parameter]) => (
            <div key={key} className={styles.parameterValues} data-testid={`parameter-item-${key}`}>
              <div className={styles.parameterLabel} data-testid={`parameter-label-${key}`}
              >{parameter.title}:</div>
              <div className={styles.parameterValue} data-testid={`parameter-value-${key}`}>{parameter.default?.toString()}</div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyStateOverlay
          title="Parameters"
          message="Parameters will appear here when a node is running and has configurable parameters."
          iconSize={30}
        />
      )}
    </div>
  );
};
