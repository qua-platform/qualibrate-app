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
  const { fetchOneSnapshot, setLatestSnapshotId } = useSnapshotsContext();
  const { setSelectedNodeNameInWorkflow } = useGraphContext();
  const { setSelectedItemName } = useSelectionContext();
  const [latestId, setLatestId] = useState<number | undefined>();
  const [latestName, setLatestName] = useState<string | undefined>();

  const handleOnClick = () => {
    setTrackLatest(!trackLatest);
  };

  useEffect(() => {
    if (trackLatest && allMeasurements && allMeasurements.length > 0) {
      const current = allMeasurements[0];
      const prev = allMeasurements[1];

      if (current.id !== latestId || current.metadata?.name !== latestName) {
        setLatestId(current.id);
        setLatestName(current.metadata?.name);
        setSelectedItemName(current.metadata?.name);
        setSelectedNodeNameInWorkflow(current.metadata?.name);
        setLatestSnapshotId(current.id);
        if (current.id !== undefined) {
          if (prev && prev.id !== undefined && current.id !== prev.id) {
            fetchOneSnapshot(current.id, prev.id, true, true);
          } else {
            fetchOneSnapshot(current.id, undefined, true, true);
          }
        }
      }
    }
  }, [trackLatest, allMeasurements, latestId, latestName]);

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
