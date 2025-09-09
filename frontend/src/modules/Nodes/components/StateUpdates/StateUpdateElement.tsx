import React, { useCallback, useEffect, useRef, useState } from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "../RunningJob/RunningJob.module.scss";
import { StateUpdateObject, useNodesContext } from "../../context/NodesContext";
import { RightArrowIcon } from "../../../../ui-lib/Icons/RightArrowIcon";
import { CircularProgress, Tooltip } from "@mui/material";
import { CheckMarkBeforeIcon } from "../../../../ui-lib/Icons/CheckMarkBeforeIcon";
import { SnapshotsApi } from "../../../Snapshots/api/SnapshotsApi";
import { CheckMarkAfterIcon } from "../../../../ui-lib/Icons/CheckMarkAfterIcon";
import { UndoIcon } from "../../../../ui-lib/Icons/UndoIcon";
import { useSnapshotsContext } from "../../../Snapshots/context/SnapshotsContext";

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

  const ValueComponent = ({
    stateUpdateValue,
    disabled,
    onClick,
    onChange,
  }: {
    stateUpdateValue: string | number;
    disabled?: boolean;
    onClick?: () => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => {
    const [isHovered, setIsHovered] = useState<boolean | undefined>(false);
    const [tooltipText, setTooltipText] = useState<string | undefined>(undefined);
    const inputRef = useRef<HTMLInputElement>(null);

    const adjustWidth = useCallback(() => {
      if (inputRef.current) {
        const value = stateUpdateValue.toString() || "";
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (context) {
          context.font = getComputedStyle(inputRef.current).font;
          const textWidth = context.measureText(value).width;
          inputRef.current.style.width = `${Math.ceil(textWidth)}px`;
        }
      }
    }, [stateUpdateValue]);

    useEffect(() => {
      adjustWidth();
    }, [stateUpdateValue, adjustWidth]);

    if (!onClick) {
      return (
        <div className={styles.valueContainer} data-testid="value-container">
          {stateUpdateValue}
        </div>
      );
    }

    return (
      <>
        <Tooltip title={`${isHovered ? tooltipText : ""}`}>
          <input
            ref={inputRef}
            className={isHovered ? styles.valueContainerHovered : disabled ? styles.valueContainerDisabled : styles.valueContainerEditable}
            data-testid="value-input"
            onMouseEnter={() => {
              if (tooltipText === undefined) {
                setTooltipText("Edit");
              }
              setIsHovered(true);
            }}
            disabled={disabled}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setTooltipText("")}
            onBlur={(e) => {
              onChange && onChange(e);
              setTooltipText("Edit");
            }}
            defaultValue={stateUpdateValue}
          />
        </Tooltip>
      </>
    );
  };

  const ValueRow = ({
    oldValue,
    newValue,
    onChange,
    parameterUpdated,
    setParameterUpdated,
  }: {
    oldValue: string | number;
    newValue: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    parameterUpdated: boolean | undefined;
    setParameterUpdated: (p: boolean) => void;
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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomValue(event.target.value);
  };
  return (
    // {!runningUpdate && !parameterUpdated && (
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
          newValue={customValue}
          onChange={handleChange}
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
