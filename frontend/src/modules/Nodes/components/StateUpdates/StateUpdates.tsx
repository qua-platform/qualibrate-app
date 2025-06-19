import React, { useState } from "react";
import { RunningNodeInfo, StateUpdate } from "../../context/NodesContext";
import { SnapshotsApi } from "../../../Snapshots/api/SnapshotsApi";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "../RunningJob/RunningJob.module.scss";
import { StateUpdateElement } from "./StateUpdateElement";
import { Button } from "@mui/material";
import Popper from "@mui/material/Popper";
import EllipsesIcon from "../../../../ui-lib/Icons/EllipsesIcon";
import StateUpdatesListPreview from "./StateUpdatesListPreview";
// import { ErrorStatusWrapper } from "../../../common/Error/ErrorStatusWrapper";
import { useSnapshotsContext } from "../../../Snapshots/context/SnapshotsContext";

export const StateUpdates: React.FC<{
  runningNodeInfo: RunningNodeInfo | undefined;
  setRunningNodeInfo: (a: RunningNodeInfo) => void;
  updateAllButtonPressed: boolean;
  setUpdateAllButtonPressed: (a: boolean) => void;
  isExpanded: boolean;
}> = ({ isExpanded, runningNodeInfo, setRunningNodeInfo, updateAllButtonPressed, setUpdateAllButtonPressed }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [stateOpen, setStateOpen] = useState(false);
  let timer: NodeJS.Timeout | null = null;
  const { trackLatestSidePanel, fetchOneSnapshot, latestSnapshotId, secondId } = useSnapshotsContext();

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
      if (result.result && trackLatestSidePanel) {
        fetchOneSnapshot(Number(latestSnapshotId), Number(secondId), false, true);
      }
    }
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (timer) clearTimeout(timer);
    setAnchorEl(event.currentTarget);
    setStateOpen(true);
  };

  const handleMouseLeave = () => {
    timer = setTimeout(() => setStateOpen(false), 100);
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
                open={stateOpen}
                anchorEl={anchorEl}
                placement="bottom-start"
                disablePortal
                transition={false}
                modifiers={[{ name: "offset", options: { offset: [0, 10] } }]}
                style={{ zIndex: 9999 }}
              >
                <div className={styles.StateUpdatesTooltipBox}>
                  <StateUpdatesListPreview runningNodeInfo={runningNodeInfo} />
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
              stateUpdateKey={key}
              index={index}
              stateUpdateObject={stateUpdateObject}
              runningNodeInfo={runningNodeInfo}
              setRunningNodeInfo={setRunningNodeInfo}
              updateAllButtonPressed={updateAllButtonPressed}
            />
          ))}
        </div>
      )}
    </>
  );
};
