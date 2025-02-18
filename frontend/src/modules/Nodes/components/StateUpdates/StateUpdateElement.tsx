import React, { useState } from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "../RunningJob/RunningJob.module.scss";
import { RunningNodeInfo, StateUpdateObject } from "../../context/NodesContext";
import { CircularProgress } from "@mui/material";
import { CheckMarkBeforeIcon } from "../../../../ui-lib/Icons/CheckMarkBeforeIcon";
import { SnapshotsApi } from "../../../Snapshots/api/SnapshotsApi";
import { CheckMarkAfterIcon } from "../../../../ui-lib/Icons/CheckMarkAfterIcon";
import { ValueRow } from "./ValueRow";

export interface StateUpdateProps {
  key: string;
  index: number;
  stateUpdateObject: StateUpdateObject;
  runningNodeInfo?: RunningNodeInfo;
  setRunningNodeInfo?: (a: RunningNodeInfo) => void;
  updateAllButtonPressed: boolean;
}

export const StateUpdateElement: React.FC<StateUpdateProps> = (props) => {
  const { key, index, stateUpdateObject, runningNodeInfo, setRunningNodeInfo, updateAllButtonPressed } = props;
  const [runningUpdate, setRunningUpdate] = React.useState<boolean>(false);
  const [parameterUpdated, setParameterUpdated] = useState<boolean>(false);
  const [customValue, setCustomValue] = useState<string | number>(JSON.stringify(stateUpdateObject.val ?? stateUpdateObject.new ?? ""));
  const [previousValue] = useState<string>(JSON.stringify(stateUpdateObject.val ?? stateUpdateObject.new ?? ""));

  const handleUpdateClick = async () => {
    if (runningNodeInfo && runningNodeInfo.idx && stateUpdateObject && ("val" in stateUpdateObject || "new" in stateUpdateObject)) {
      setRunningUpdate(true);
      const stateUpdateValue = customValue ? customValue : (stateUpdateObject.val ?? stateUpdateObject.new!);
      const response = await SnapshotsApi.updateState(runningNodeInfo?.idx, key, stateUpdateValue);

      const stateUpdate = { ...stateUpdateObject, stateUpdated: response.result! };
      if (setRunningNodeInfo) {
        setRunningNodeInfo({
          ...runningNodeInfo,
          state_updates: { ...runningNodeInfo.state_updates, [key]: stateUpdate },
        });
      }
      setParameterUpdated(response.result!);
      setRunningUpdate(false);
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomValue(event.target.value);
  };
  return (
    <div key={`${key}-wrapper`} className={styles.stateUpdateWrapper} data-testid={`state-update-wrapper-${key}`}>
      <div className={styles.stateUpdateOrderNumberAndTitleWrapper}>
        <div className={styles.stateUpdateOrderNumber}>{index + 1}</div>
        <div className={styles.stateUpdateOrderKey} data-testid={`state-update-key-${index}`}>
          {key}
        </div>
      </div>
      <div className={styles.stateUpdateValueWrapper} data-testid={`state-update-value-wrapper-${index}`}>
        <ValueRow
          oldValue={JSON.stringify(stateUpdateObject.old)}
          newValue={customValue}
          onChange={handleChange}
          parameterUpdated={parameterUpdated || updateAllButtonPressed}
          setParameterUpdated={setParameterUpdated}
          customValue={customValue}
          setCustomValue={setCustomValue}
          previousValue={previousValue}
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
