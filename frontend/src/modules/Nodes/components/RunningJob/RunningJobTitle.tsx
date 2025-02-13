import React from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./RunningJob.module.scss";
import { useNodesContext } from "../../context/NodesContext";
import { SnapshotsApi } from "../../../Snapshots/api/SnapshotsApi";
import { StopIcon } from "../../../../ui-lib/Icons/StopIcon";

export const RunningJobTitleRow: React.FC = () => {
  const { runningNode, isNodeRunning, setIsNodeRunning } = useNodesContext();

  const insertSpaces = (str: string, interval = 40): string => {
    let result = "";
    for (let i = 0; i < str.length; i += interval) {
      result += str.slice(i, i + interval) + " ";
    }
    return result.trim();
  };

  const handleStopClick = () => {
    SnapshotsApi.stopNodeRunning().then((res) => {
      if (res.isOk) {
        setIsNodeRunning(!res.result);
      }
    });
  };

  const runningJobName = runningNode?.name ? insertSpaces(runningNode?.name) : "";

  return (
    <div className={styles.title} data-testid="running-job-title">
      <div className={styles.dot} data-testid="running-job-dot"></div>
      <div className={styles.runningJobWrapper} data-testid="running-job-name-wrapper">
        <div className={styles.runningJobNameWrapper}>
          <div>Running job{runningNode?.name ? ":" : ""}</div>
          <div className={styles.runningJobName} data-testid="running-job-name">
            &nbsp;&nbsp;{runningJobName}
          </div>
        </div>
      </div>
      {isNodeRunning && (
        <div className={styles.stopButtonWrapper}>
          <div onClick={handleStopClick} data-testid="stop-button">
            <StopIcon />
          </div>
        </div>
      )}
    </div>
  );
};
