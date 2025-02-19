import React, { Dispatch, SetStateAction } from "react";
import { SnapshotDTO } from "../../../Snapshots/SnapshotDTO";

interface Props {
  allSnapshots: SnapshotDTO[];
  selectedSnapshotIndex: number | undefined;
  setSelectedSnapshotIndex: Dispatch<SetStateAction<number | undefined>>;
  setSelectedSnapshotId: Dispatch<SetStateAction<number | undefined>>;
  setFlag: Dispatch<SetStateAction<boolean>>;
  fetchOneGitgraphSnapshot: (snapshots: SnapshotDTO[], selectedIndex: number) => void;
}

// This should be the whole section on the left that contains DataRowElements
export const DataSection = ({
  allSnapshots,
  // selectedSnapshotIndex,
  // setSelectedSnapshotIndex,
  // setSelectedSnapshotId,
  // setFlag,
  // fetchOneGitgraphSnapshot,
}: Props) => {
  return (allSnapshots ?? []).map((snapshot) => {
    return <div>{snapshot.id}</div>;
  });
};
