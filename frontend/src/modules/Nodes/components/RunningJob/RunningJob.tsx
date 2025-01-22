import React from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./RunningJob.module.scss";
import { StateUpdate, useNodesContext } from "../../context/NodesContext";
import { SnapshotsApi } from "../../../Snapshots/api/SnapshotsApi";
import { StateUpdates } from "../StateUpdates/StateUpdates";
import { StopIcon } from "../../../../ui-lib/Icons/StopIcon";
import { RunningJobInfoSection } from "./RunningJobInfoSection";
import { RunningJobParameters } from "./RunningJobParameters";
import { CollapsedComponentIcon } from "../../../../ui-lib/Icons/CollapsedComponentIcon";
import { Button } from "@mui/material";

interface IProps {
  resultSectionExpanded?: boolean;
}

export const RunningJob: React.FC<IProps> = ({ resultSectionExpanded }) => {
  const {
    runningNode,
    runningNodeInfo,
    setRunningNodeInfo,
    isNodeRunning,
    setIsNodeRunning,
    updateAllButtonPressed,
    setUpdateAllButtonPressed,
  } = useNodesContext();
  const [showTooltipComponentName, setShowTooltipComponentName] = React.useState<string | undefined>();

  const insertSpaces = (str: string, interval = 40) => {
    let result = "";
    for (let i = 0; i < str.length; i += interval) {
      result += str.slice(i, i + interval) + " ";
    }
    return result.trim();
  };

  const handleStopClick = () => {
    SnapshotsApi.stopNodeRunning().then((res) => {
      if (res.isOk) {
        setIsNodeRunning(!res.result);
      }
    });
  };

  const handleMouseOver = (componentName: string) => {
    setShowTooltipComponentName(componentName);
  };

  const handleUpdateAllClick = async (stateUpdates: StateUpdate) => {
    const litOfUpdates = Object.entries(stateUpdates ?? {})
      .filter(([, stateUpdateObject]) => !stateUpdateObject.stateUpdated)
      .map(([key, stateUpdateObject]) => {
        return {
          data_path: key,
          value: stateUpdateObject.val ?? stateUpdateObject.new!,
        };
      });
    const result = await SnapshotsApi.updateStates(runningNodeInfo?.idx ?? "", litOfUpdates);
    if (result.isOk) {
      setUpdateAllButtonPressed(result.result!);
    }
  };

  if (!resultSectionExpanded) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.title}>
          <div className={styles.dot}></div>
          <div className={styles.runningJobWrapper}>
            <div className={styles.runningJobNameWrapper}>
              <div>Running job{runningNode?.name ? ":" : ""}</div>
              <div className={styles.runningJobName}>&nbsp;&nbsp;{runningNode?.name ? insertSpaces(runningNode?.name) : ""}</div>
            </div>
          </div>
          {isNodeRunning && (
            <div className={styles.stopButtonWrapper}>
              <div onClick={handleStopClick}>
                <StopIcon />
              </div>
            </div>
          )}
        </div>
        {runningNodeInfo && <RunningJobInfoSection />}
        <div className={styles.parameterStatesWrapper}>
          {!resultSectionExpanded && (
            <>
              <div className={styles.parameterColumnWrapper}>
                <div className={styles.parameterColumnCollapsedWrapper}>
                  <div>Parameters</div>
                  <div
                    className={styles.parameterColumnCollapsedIconWrapper}
                    onMouseOver={() => handleMouseOver("parameters")}
                    onMouseLeave={() => setShowTooltipComponentName(undefined)}
                  >
                    <CollapsedComponentIcon />
                    {runningNodeInfo && showTooltipComponentName === "parameters" && (
                      <div className={styles.tooltipPopUpWrapper}>
                        <RunningJobParameters showTitle={false} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.statesColumnWrapper}>
                <div className={styles.parameterColumnCollapsedWrapper}>
                  {/*<div className={styles.stateWrapper}>*/}
                  <div className={styles.stateTitleRow}>
                    State updates&nbsp;
                    {runningNodeInfo?.state_updates && Object.keys(runningNodeInfo?.state_updates).length > 0
                      ? `(${Object.keys(runningNodeInfo?.state_updates).length})`
                      : ""}
                    <div
                      className={styles.parameterColumnCollapsedIconWrapper}
                      onMouseOver={() => handleMouseOver("stateUpdates")}
                      // onMouseLeave={() => setShowTooltipComponentName(undefined)}
                    >
                      <CollapsedComponentIcon />

                      {runningNodeInfo && showTooltipComponentName === "stateUpdates" && (
                        <div className={styles.tooltipPopUpWrapper}>
                          <StateUpdates
                            showTitle={false}
                            showUpdateButton={false}
                            runningNodeInfo={runningNodeInfo}
                            setRunningNodeInfo={setRunningNodeInfo}
                            updateAllButtonPressed={updateAllButtonPressed}
                            handleUpdateAllClick={handleUpdateAllClick}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {updateAllButtonPressed ||
                    (Object.entries(runningNodeInfo?.state_updates ?? {}).filter(([, stateUpdateObject]) => !stateUpdateObject.stateUpdated)
                      .length > 0 && (
                      <Button
                        className={styles.updateAllButton}
                        disabled={updateAllButtonPressed}
                        onClick={() => handleUpdateAllClick(runningNodeInfo?.state_updates ?? {})}
                      >
                        Accept All
                      </Button>
                    ))}
                  {/*</div>*/}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <div className={styles.dot}></div>
        <div className={styles.runningJobWrapper}>
          <div className={styles.runningJobNameWrapper}>
            <div>Running job{runningNode?.name ? ":" : ""}</div>
            <div className={styles.runningJobName}>&nbsp;&nbsp;{runningNode?.name ? insertSpaces(runningNode?.name) : ""}</div>
          </div>
        </div>
        {isNodeRunning && (
          <div className={styles.stopButtonWrapper}>
            <div onClick={handleStopClick}>
              <StopIcon />
            </div>
          </div>
        )}
      </div>
      {runningNodeInfo && <RunningJobInfoSection />}
      <div className={styles.parameterStatesWrapper}>
        <div className={styles.parameterColumnWrapper}>{runningNodeInfo && <RunningJobParameters />}</div>
        <div className={styles.statesColumnWrapper}>
          <StateUpdates
            runningNodeInfo={runningNodeInfo}
            setRunningNodeInfo={setRunningNodeInfo}
            updateAllButtonPressed={updateAllButtonPressed}
            setUpdateAllButtonPressed={setUpdateAllButtonPressed}
          />
        </div>
      </div>
    </div>
  );
};
