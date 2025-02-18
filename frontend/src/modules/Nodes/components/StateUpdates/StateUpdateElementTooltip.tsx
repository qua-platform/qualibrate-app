import React, { useState } from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "../RunningJob/RunningJob.module.scss";
import { RunningNodeInfo, StateUpdateObject } from "../../context/NodesContext";
import { ValueRowTooltip } from "./ValueRowTooltip";

export interface StateUpdateProps {
  key: string;
  index: number;
  stateUpdateObject: StateUpdateObject;
  runningNodeInfo?: RunningNodeInfo;
  setRunningNodeInfo?: (a: RunningNodeInfo) => void;
  updateAllButtonPressed: boolean;
}

export const StateUpdateElementTooltip: React.FC<StateUpdateProps> = (props) => {
  const { key, index, stateUpdateObject, runningNodeInfo, setRunningNodeInfo, updateAllButtonPressed } = props;
  const [runningUpdate, setRunningUpdate] = React.useState<boolean>(false);
  const [parameterUpdated, setParameterUpdated] = useState<boolean>(false);
  const [customValue, setCustomValue] = useState<string | number>(JSON.stringify(stateUpdateObject.val ?? stateUpdateObject.new ?? ""));
  const [previousValue] = useState<string>(JSON.stringify(stateUpdateObject.val ?? stateUpdateObject.new ?? ""));

  return (
    <div key={`${key}-wrapper`} className={styles.stateUpdateWrapper} data-testid={`state-update-wrapper-${key}`}>
      <div className={styles.stateUpdateOrderNumberAndTitleWrapper}>
        <div className={styles.stateUpdateOrderNumber}>{index + 1}</div>
        <div className={styles.stateUpdateOrderKey} data-testid={`state-update-key-${index}`}>
          {key}
        </div>
      </div>
      <div className={styles.stateUpdateValueWrapper} data-testid={`state-update-value-wrapper-${index}`}>
        <ValueRowTooltip
          oldValue={JSON.stringify(stateUpdateObject.old)}
          newValue={customValue}
          parameterUpdated={parameterUpdated || updateAllButtonPressed}
          setParameterUpdated={setParameterUpdated}
        />
      </div>
    </div>
  );
};
