import React, { useCallback } from "react";
import { StateUpdate, useNodesContext } from "../../context/NodesContext";
import { SnapshotsApi } from "../../../Snapshots/api/SnapshotsApi";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "../RunningJob/RunningJob.module.scss";
import { StateUpdateElement } from "./StateUpdateElement";
import { Button } from "@mui/material";
import { useSnapshotsContext } from "../../../Snapshots/context/SnapshotsContext";

export const StateUpdates: React.FC = () => {
  const { trackLatestSidePanel, fetchOneSnapshot, latestSnapshotId, secondId } = useSnapshotsContext();
  const { runningNodeInfo, updateAllButtonPressed, setUpdateAllButtonPressed } = useNodesContext();

  const stateUpdates = runningNodeInfo?.state_updates ?? {};

  const handleStateUpdates = async (updates: StateUpdate) => {
    const listOfUpdates = Object.entries(updates)
      .filter(([, stateUpdateObject]) => !stateUpdateObject.stateUpdated)
      .map(([key, stateUpdateObject]) => ({
        data_path: key,
        value: stateUpdateObject.val ?? stateUpdateObject.new!,
      }));

    const result = await SnapshotsApi.updateStates(runningNodeInfo?.idx ?? "", listOfUpdates);

    if (result.isOk) {
      setUpdateAllButtonPressed(result.result!);
      if (result.result && trackLatestSidePanel) {
        fetchOneSnapshot(Number(latestSnapshotId), Number(secondId), false, true);
      }
    }
  };

  const handleOnClick = useCallback(() => handleStateUpdates(stateUpdates), [stateUpdates]);

  const pendingUpdatesCount = Object.entries(stateUpdates).filter(([, stateUpdateObject]) => !stateUpdateObject.stateUpdated).length;

  return (
    <>
      <div className={styles.stateWrapper} data-testid="state-wrapper">
        <div className={styles.stateTitle} data-testid="state-title">
          State updates&nbsp;
          {Object.keys(stateUpdates).length > 0 ? `(${Object.keys(stateUpdates).length})` : ""}
        </div>

        {updateAllButtonPressed ||
          (pendingUpdatesCount > 0 && (
            <Button
              className={styles.updateAllButton}
              data-testid="update-all-button"
              disabled={updateAllButtonPressed}
              onClick={handleOnClick}
            >
              Accept All
            </Button>
          ))}
      </div>

      {Object.keys(stateUpdates).length > 0 && (
        <div className={styles.stateUpdatesTopWrapper} data-testid="state-updates-top-wrapper">
          {Object.entries(stateUpdates).map(([key, stateUpdateObject], index) => (
            <StateUpdateElement key={key} keyValue={key} index={index} stateUpdateObject={stateUpdateObject} />
          ))}
        </div>
      )}
    </>
  );
};
