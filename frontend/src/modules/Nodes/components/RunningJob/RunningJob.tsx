import React, { useState } from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./RunningJob.module.scss";
import { useNodesContext } from "../../context/NodesContext";
import { StateUpdates } from "../StateUpdates/StateUpdates";
import { RunningJobNodeProgressTracker } from "./RunningJobNodeProgressTracker";
import { RunningJobParameters } from "./RunningJobParameters";
import ExpandCollapseIcon from "../../../../ui-lib/Icons/ExpandCollapseIcon";

export const RunningJob: React.FC = () => {
  const {
    runningNodeInfo,
    setRunningNodeInfo,
    updateAllButtonPressed,
    setUpdateAllButtonPressed,
    lastRunStatusNode,
  } = useNodesContext();

  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={styles.wrapper} data-testid="running-job-wrapper">
      {lastRunStatusNode !== null && <RunningJobNodeProgressTracker />}
      
      <div className={styles.parameterStatesWrapper}>
        <div className={styles.parameterColumnWrapper}>
          <RunningJobParameters isExpanded={isExpanded} />
        </div>
        <div className={styles.statesColumnWrapper} data-testid="states-column-wrapper">
          <StateUpdates
            runningNodeInfo={runningNodeInfo}
            setRunningNodeInfo={setRunningNodeInfo}
            updateAllButtonPressed={updateAllButtonPressed}
            setUpdateAllButtonPressed={setUpdateAllButtonPressed}
            isExpanded={isExpanded}
          />
        </div>
      </div>

      <button className={styles.toggleIconWrapper} onClick={() => setIsExpanded((prev) => !prev)} title={isExpanded ? "Collapse run info" : "Expand run info"} >
        <ExpandCollapseIcon direction={isExpanded ? "up" : "down"} />
      </button>
    </div>
  );
};
