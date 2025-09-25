import React, { useState } from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "../RunningJob/RunningJob.module.scss";
import { StateUpdateObject, useNodesContext } from "../../context/NodesContext";
import { CircularProgress } from "@mui/material";
import { CheckMarkBeforeIcon } from "../../../../ui-lib/Icons/CheckMarkBeforeIcon";
import { SnapshotsApi } from "../../../Snapshots/api/SnapshotsApi";
import { CheckMarkAfterIcon } from "../../../../ui-lib/Icons/CheckMarkAfterIcon";
import { useSnapshotsContext } from "../../../Snapshots/context/SnapshotsContext";
import { ValueRow } from "./ValueRow";

interface StateUpdateProps {
  keyValue: string;
  index: number;
  stateUpdateObject: StateUpdateObject;
}

export const StateUpdateElement: React.FC<StateUpdateProps> = (props) => {
  const { keyValue, index, stateUpdateObject } = props;
  const [runningUpdate, setRunningUpdate] = React.useState<boolean>(false);
  const [parameterUpdated, setParameterUpdated] = useState<boolean>(false);
  const [customValue, setCustomValue] = useState<string | number>(JSON.stringify(stateUpdateObject.val ?? stateUpdateObject.new ?? ""));
  const previousValue = JSON.stringify(stateUpdateObject.val ?? stateUpdateObject.new ?? "");
  const { runningNodeInfo, setRunningNodeInfo, updateAllButtonPressed } = useNodesContext();

  const { secondId, fetchOneSnapshot, trackLatestSidePanel, latestSnapshotId } = useSnapshotsContext();

  const handleUpdateClick = async () => {
    if (runningNodeInfo && runningNodeInfo.idx && stateUpdateObject && ("val" in stateUpdateObject || "new" in stateUpdateObject)) {
      setRunningUpdate(true);
      const stateUpdateValue = customValue ? customValue : (stateUpdateObject.val ?? stateUpdateObject.new!);
      const response = await SnapshotsApi.updateState(runningNodeInfo?.idx, keyValue, stateUpdateValue);

      const stateUpdate = { ...stateUpdateObject, stateUpdated: response.result! };
      if (response.isOk && response.result && trackLatestSidePanel) {
        fetchOneSnapshot(Number(latestSnapshotId), Number(secondId), false, true);
      }
      if (setRunningNodeInfo) {
        setRunningNodeInfo({
          ...runningNodeInfo,
          state_updates: { ...runningNodeInfo.state_updates, [keyValue]: stateUpdate },
        });
      }
      setParameterUpdated(response.result!);
      setRunningUpdate(false);
    }
  };
  return (
    <div key={`${keyValue}-wrapper`} className={styles.stateUpdateWrapper} data-testid={`state-update-wrapper-${keyValue}`}>
      <div className={styles.stateUpdateOrderNumberAndTitleWrapper}>
        <div className={styles.stateUpdateOrderNumber}>{index + 1}</div>
        <div className={styles.stateUpdateOrderKey} data-testid={`state-update-key-${index}`}>
          {keyValue}
        </div>
      </div>
      <div className={styles.stateUpdateValueWrapper} data-testid={`state-update-value-wrapper-${index}`}>
        <ValueRow
          oldValue={JSON.stringify(stateUpdateObject.old)}
          previousValue={previousValue}
          customValue={customValue}
          setCustomValue={setCustomValue}
          parameterUpdated={parameterUpdated || updateAllButtonPressed}
          setParameterUpdated={setParameterUpdated}
        />
        {!runningUpdate && !parameterUpdated && !updateAllButtonPressed && (
          <div className={styles.stateUpdateIconBeforeWrapper} data-testid="update-before-icon" onClick={handleUpdateClick}>
            <CheckMarkBeforeIcon />
          </div>
        )}
        {runningUpdate && !parameterUpdated && (
          <div className={styles.stateUpdateIconAfterWrapper} data-testid="update-in-progress">
            <CircularProgress size={17} />
          </div>
        )}
        {(parameterUpdated || updateAllButtonPressed) && (
          <div className={styles.stateUpdateIconAfterWrapper} data-testid="update-after-icon">
            <CheckMarkAfterIcon />
          </div>
        )}
      </div>
    </div>
  );
};
