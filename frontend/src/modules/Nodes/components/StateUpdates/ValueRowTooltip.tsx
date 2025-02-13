import React from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "../RunningJob/RunningJob.module.scss";
import { ValueComponent } from "./ValueComponent";
import { RightArrowIcon } from "../../../../ui-lib/Icons/RightArrowIcon";

interface IProps {
  oldValue: string | number;
  newValue: string | number;
  parameterUpdated: boolean | undefined;
  setParameterUpdated: (p: boolean) => void;
}

export const ValueRowTooltip: React.FC<IProps> = ({ oldValue, newValue, parameterUpdated }) => {
  return (
    <>
      <div className={styles.stateUpdateValueOld}>
        <ValueComponent stateUpdateValue={oldValue} />
      </div>
      <div className={styles.stateUpdateRightArrowIconWrapper}>
        <RightArrowIcon />
      </div>
      {!parameterUpdated && (
        <div className={styles.stateUpdateValueNew}>
          <ValueComponent stateUpdateValue={newValue} onClick={() => {}} onChange={() => {}} />
        </div>
      )}
      {parameterUpdated && (
        <div className={styles.stateUpdateValueNew}>
          <ValueComponent stateUpdateValue={newValue} disabled={parameterUpdated} onChange={() => {}} />
        </div>
      )}
    </>
  );
};
