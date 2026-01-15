import React from "react";
import styles from "./SnapshotsTimeline.module.scss";
import { useSelector } from "react-redux";
import {
  fetchOneSnapshot,
  getAllSnapshots,
  getSelectedSnapshotId,
  setClickedForSnapshotSelection,
  setSelectedSnapshot,
  setSelectedSnapshotId,
  SnapshotDTO,
} from "../../../../stores/SnapshotsStore";
import { useRootDispatch } from "../../../../stores";
import ExecutionCard from "../ExecutionCard";

export const SnapshotsTimeline = () => {
  const dispatch = useRootDispatch();
  const allSnapshots = useSelector(getAllSnapshots);
  const selectedSnapshotId = useSelector(getSelectedSnapshotId);

  const handleOnClick = (snapshot: SnapshotDTO) => {
    dispatch(setSelectedSnapshotId(snapshot.id));
    dispatch(setSelectedSnapshot(snapshot));
    dispatch(setClickedForSnapshotSelection(true));
    dispatch(fetchOneSnapshot(snapshot.id));
  };
  return (
    allSnapshots?.length > 0 && (
      <div className={styles.wrapper}>
        {allSnapshots.map((snapshot) => {
          return (
            <ExecutionCard
              key={snapshot.id}
              snapshot={snapshot}
              isSelected={snapshot.id === selectedSnapshotId}
              handleOnClick={() => handleOnClick(snapshot)}
            />
          );
        })}
      </div>
    )
  );
};
