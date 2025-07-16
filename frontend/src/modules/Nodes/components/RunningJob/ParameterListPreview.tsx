import React from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./RunningJob.module.scss";
import { useNodesContext } from "../../context/NodesContext";

const ParameterListPreview: React.FC = () => {
  const { runningNode } = useNodesContext();

  return (
    <div className={styles.parameterContent} data-testid="parameters-list">
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
  );
};

export default ParameterListPreview;
