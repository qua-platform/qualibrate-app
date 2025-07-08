import React, { useEffect, useState } from "react";
import styles from "./MeasurementElementGraph.module.scss";
import CytoscapeGraph from "../../../CytoscapeGraph/CytoscapeGraph";
import cytoscape from "cytoscape";
import { LastRunInfo } from "../../../../context/GraphContext";
import { classNames } from "../../../../../../utils/classnames";

interface IProps {
  workflowGraphElements: cytoscape.ElementDefinition[];
  onCytoscapeNodeClick?: (name: string) => void;
  active?: boolean;
  nodesCompleted?: number;
  runDuration?: number;
  lastRunInfo?: LastRunInfo;
}

export const MeasurementElementGraph: React.FC<IProps> = ({ workflowGraphElements, onCytoscapeNodeClick, lastRunInfo }) => {
  const [tuneUpName, setTuneUpName] = useState<string | undefined>(lastRunInfo?.workflowName);

  useEffect(() => {
    if (lastRunInfo?.workflowName) {
      setTuneUpName(lastRunInfo.workflowName);
    }
  }, [lastRunInfo?.workflowName]);

  const isRunning = lastRunInfo?.active;

  return (
    <div className={styles.wrapper}>
      <div className={styles.calibrationTitle}>
        <span
          className={classNames(
            styles.dot,
            isRunning ? styles.blinkingYellow : lastRunInfo?.active === false ? styles.solidGreen : styles.defaultBlue
          )}
        />
        <span className={styles.label}>Active Calibration Graph:</span>
        <span className={styles.tuneUpName}>{tuneUpName || "Unknown Tune-up"}</span>
      </div>

      <div className={styles.insideWrapper}>
        <div className={styles.lowerContainer}>
          <div className={styles.lowerLowerContainer}>
            <CytoscapeGraph elements={workflowGraphElements} onNodeClick={onCytoscapeNodeClick} />
          </div>
        </div>
      </div>
    </div>
  );
};
