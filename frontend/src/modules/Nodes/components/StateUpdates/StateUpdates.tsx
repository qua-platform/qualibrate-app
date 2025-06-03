import React, { useState } from "react";
import { RunningNodeInfo, StateUpdate } from "../../context/NodesContext";
import { SnapshotsApi } from "../../../Snapshots/api/SnapshotsApi";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "../RunningJob/RunningJob.module.scss";
import { StateUpdateElement } from "./StateUpdateElement";
import { Button } from "@mui/material";
import Popper from "@mui/material/Popper";
import EllipsesIcon from "../../../../ui-lib/Icons/EllipsesIcon";
import { RightArrowIcon } from "../../../../ui-lib/Icons/RightArrowIcon";

const StateUpdatesPreview: React.FC<{
  runningNodeInfo: RunningNodeInfo | undefined;
  setRunningNodeInfo: (a: RunningNodeInfo) => void;
  updateAllButtonPressed: boolean;
}> = ({ runningNodeInfo }) => {
  return (
    <div className={styles.stateUpdatesTopWrapper}>
      {Object.entries(runningNodeInfo?.state_updates ?? {}).map(([key, stateUpdateObject], index) => (
        <div key={`${key}-preview`} className={styles.stateUpdatePreviewRow}>
          <div className={styles.previewKey}>
            {index + 1}&nbsp;&nbsp;<span className={styles.previewPath}>{key}</span>
          </div>
          <div className={styles.previewValues}>
            <span className={styles.valueContainer}>{JSON.stringify(stateUpdateObject.old)}</span>
            <RightArrowIcon />
            <span className={styles.valueContainerHovered}>
              {JSON.stringify(stateUpdateObject.val ?? stateUpdateObject.new)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};


export const StateUpdates: React.FC<{
  runningNodeInfo: RunningNodeInfo | undefined;
  setRunningNodeInfo: (a: RunningNodeInfo) => void;
  updateAllButtonPressed: boolean;
  setUpdateAllButtonPressed: (a: boolean) => void;
  isExpanded: boolean;
}> = ({ isExpanded, runningNodeInfo, setRunningNodeInfo, updateAllButtonPressed, setUpdateAllButtonPressed }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  let timer: NodeJS.Timeout | null = null;

  const handleClick = async (stateUpdates: StateUpdate) => {
    const listOfUpdates = Object.entries(stateUpdates ?? {})
      .filter(([, obj]) => !obj.stateUpdated)
      .map(([key, obj]) => ({
        data_path: key,
        value: obj.val ?? obj.new!,
      }));
    const result = await SnapshotsApi.updateStates(runningNodeInfo?.idx ?? "", listOfUpdates);
    if (result.isOk) {
      setUpdateAllButtonPressed(result.result!);
    }
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (timer) clearTimeout(timer);
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timer = setTimeout(() => setOpen(false), 100);
  };

  return (
    <>
      {/*{Object.entries(runningNodeInfo?.state_updates ?? {}).filter(([, stateUpdateObject]) => !stateUpdateObject.stateUpdated).length >*/}
      {/*  0 && (*/}
      <div className={styles.stateWrapper} data-testid="state-wrapper">
        <div className={styles.stateTitle} data-testid="state-title">
          State updates&nbsp;
          {runningNodeInfo?.state_updates && Object.keys(runningNodeInfo.state_updates).length > 0
            ? `(${Object.keys(runningNodeInfo.state_updates).length})`
            : ""}
          {!isExpanded && (
            <span className={styles.tooltipWrapper} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <span className={styles.tooltipIcon}>&nbsp;<EllipsesIcon /></span>
              <Popper
                open={open}
                anchorEl={anchorEl}
                placement="bottom-start"
                disablePortal
                transition={false}
                modifiers={[{ name: "offset", options: { offset: [0, 10] } }]}
                style={{ zIndex: 9999 }}
              >
                <div className={styles.StateUpdatesTooltipBox}>
                  <StateUpdatesPreview
                    runningNodeInfo={runningNodeInfo}
                    setRunningNodeInfo={setRunningNodeInfo}
                    updateAllButtonPressed={updateAllButtonPressed}
                  />
                </div>
              </Popper>
            </span>
          )}
        </div>
        {updateAllButtonPressed ||
          (Object.entries(runningNodeInfo?.state_updates ?? {}).some(([, obj]) => !obj.stateUpdated) && (
            <Button
              className={styles.updateAllButton}
              data-testid="update-all-button"
              disabled={updateAllButtonPressed}
              onClick={() => handleClick(runningNodeInfo?.state_updates ?? {})}
            >
              Accept All
            </Button>
          ))}
      </div>
      {/*// )}*/}
      {isExpanded && runningNodeInfo?.state_updates && (
        <div className={styles.stateUpdatesTopWrapper} data-testid="state-updates-top-wrapper">
          {/*{runningNodeInfo?.error && <ErrorStatusWrapper error={runningNodeInfo?.error} />}*/}
          {Object.entries(runningNodeInfo.state_updates).map(([key, stateUpdateObject], index) => (
            <StateUpdateElement
              key={`${key}-expanded`}
              index={index}
              stateUpdateObject={stateUpdateObject}
              runningNodeInfo={runningNodeInfo}
              setRunningNodeInfo={setRunningNodeInfo}
              updateAllButtonPressed={updateAllButtonPressed}
              stateUpdateKey={key}
            />
          ))}
        </div>
      )}
    </>
  );
};
