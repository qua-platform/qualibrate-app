import React from "react";
import { useNodesContext } from "../../context/NodesContext";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "../RunningJob/RunningJob.module.scss";
import { StateUpdateProps } from "./StateUpdateElement";
import { ErrorStatusWrapper } from "../../../common/Error/ErrorStatusWrapper";
import { StateUpdateElementTooltip } from "./StateUpdateElementTooltip";

export const StateUpdatesTooltip: React.FC = () => {
  const { runningNodeInfo, setRunningNodeInfo, updateAllButtonPressed, setUpdateAllButtonPressed } = useNodesContext();

  return (
    <>
      {runningNodeInfo?.state_updates && (
        <div className={styles.stateUpdatesTopWrapper} data-testid="state-updates-top-wrapper">
          {Object.entries(runningNodeInfo?.state_updates ?? {}).map(([key, stateUpdateObject], index) =>
            StateUpdateElementTooltip({
              key,
              index,
              stateUpdateObject,
              runningNodeInfo,
              setRunningNodeInfo,
              updateAllButtonPressed,
            } as StateUpdateProps)
          )}
          {runningNodeInfo?.error && <ErrorStatusWrapper error={runningNodeInfo?.error} />}
        </div>
      )}
    </>
  );
};
