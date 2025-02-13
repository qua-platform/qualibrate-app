import React from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "../RunningJob/RunningJob.module.scss";
import { ValueComponent } from "./ValueComponent";
import { RightArrowIcon } from "../../../../ui-lib/Icons/RightArrowIcon";
import { UndoIcon } from "../../../../ui-lib/Icons/UndoIcon";

interface IProps {
  oldValue: string | number;
  newValue: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  parameterUpdated: boolean | undefined;
  setParameterUpdated: (p: boolean) => void;
  customValue: string | number;
  setCustomValue: (value: string | number) => void;
  previousValue: string;
}

export const ValueRow: React.FC<IProps> = ({
  oldValue,
  newValue,
  onChange,
  parameterUpdated,
  setParameterUpdated,
  customValue,
  setCustomValue,
  previousValue,
}) => {
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
          <ValueComponent
            stateUpdateValue={newValue}
            onClick={() => {
              setParameterUpdated(true);
            }}
            onChange={onChange}
          />
          {customValue !== previousValue && (
            <div
              className={styles.stateUpdateUndoIconWrapper}
              data-testid="undo-icon-wrapper"
              onClick={() => {
                setCustomValue(previousValue);
              }}
            >
              <UndoIcon />
            </div>
          )}
        </div>
      )}
      {parameterUpdated && (
        <div className={styles.stateUpdateValueNew}>
          <ValueComponent stateUpdateValue={newValue} disabled={parameterUpdated} onChange={onChange} />
        </div>
      )}
    </>
  );
};
