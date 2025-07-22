import React, { useEffect, useState } from "react";
import styles from "./MeasurementHistory.module.scss";
import { useGraphStatusContext } from "../../context/GraphStatusContext";
import { MeasurementElementList } from "../MeasurementElementList/MeasurementElementList";
import { useSelectionContext } from "../../../../../common/context/SelectionContext";
import { useGraphContext } from "../../../../context/GraphContext";
import { useSnapshotsContext } from "../../../../../Snapshots/context/SnapshotsContext";

interface IMeasurementHistoryListProps {
  title?: string;
}

export const MeasurementHistory: React.FC<IMeasurementHistoryListProps> = ({ title = "Execution history" }) => {
  const { allMeasurements, trackLatest, setTrackLatest } = useGraphStatusContext();
  const { trackLatestSidePanel, fetchOneSnapshot, setLatestSnapshotId, graphIsRunning, freezeLatestSnapshot } = useSnapshotsContext();
  const { setSelectedNodeNameInWorkflow } = useGraphContext();
  const { setSelectedItemName } = useSelectionContext();
  const [latestId, setLatestId] = useState<number | undefined>();
  const [latestName, setLatestName] = useState<string | undefined>();

  const handleOnClick = () => {
    setTrackLatest(!trackLatest);
  };

  useEffect(() => {
    if (freezeLatestSnapshot) return;
    if ((allMeasurements ?? []).length > 0) {
      const current = (allMeasurements ?? [])[0];
      if (current.id !== undefined && (current.id !== latestId || current.metadata?.name !== latestName)) {
        setLatestId(current.id);
        setLatestName(current.metadata?.name);
        setSelectedItemName(current.metadata?.name);
        setSelectedNodeNameInWorkflow(current.metadata?.name);
        setLatestSnapshotId(current.id);
        if (trackLatest && graphIsRunning) {
          if (trackLatestSidePanel) {
            const prev = (allMeasurements ?? [])[1];
            if (prev && prev.id !== undefined && current.id !== prev.id) {
              fetchOneSnapshot(current.id, prev.id, true, true);
            } else {
              fetchOneSnapshot(current.id, undefined, true, true);
            }
          } else {
            fetchOneSnapshot(current.id);
          }
        }
        // When graph stops running but trackLatest is still on, freeze on last node
        if (!graphIsRunning && trackLatest) {
          setSelectedItemName(current.metadata?.name);
          setSelectedNodeNameInWorkflow(current.metadata?.name);
          setLatestSnapshotId(current.id);
          fetchOneSnapshot(current.id); // Final snapshot without compare
        }
      }
    }
  }, [trackLatest, allMeasurements, graphIsRunning, latestId, latestName, freezeLatestSnapshot, setSelectedItemName, setSelectedNodeNameInWorkflow, setLatestSnapshotId, fetchOneSnapshot]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleRow}>
        <div className={styles.title}>{title}</div>
        <div className={styles.trackLatestWrapper}>
          <span>Track latest</span>
          <div className={`${styles.toggleSwitch} ${trackLatest ? styles.toggleOn : styles.toggleOff}`} onClick={handleOnClick}>
            <div className={`${styles.toggleKnob} ${trackLatest ? styles.toggleOn : styles.toggleOff}`}></div>
          </div>
        </div>
      </div>
      {allMeasurements && allMeasurements?.length > 0 && (
        <div className={styles.contentContainer}>
          {/*<div className={styles.lowerContainer}>*/}
          <MeasurementElementList listOfMeasurements={allMeasurements} />
          {/*</div>*/}
        </div>
      )}
      {(!allMeasurements || allMeasurements?.length === 0) && (
        <div className={styles.contentContainer}>
          <div className={styles.lowerContainer}>No measurements found</div>
        </div>
      )}
    </div>
  );
};
