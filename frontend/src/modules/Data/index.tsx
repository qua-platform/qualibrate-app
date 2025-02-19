import React from "react";
import styles from "../Data/Data.module.scss";
import cyKeys from "../../utils/cyKeys";
import useModuleStyle from "../../ui-lib/hooks/useModuleStyle";
import { classNames } from "../../utils/classnames";
import { SnapshotsContextProvider, useSnapshotsContext } from "../Snapshots/context/SnapshotsContext";
import PaginationWrapper from "../Pagination/PaginationWrapper";
import { JSONEditor } from "../common/JSONEditor/JSONEditor";
import { TimelineGraph } from "./components/TimelineGraph";

const Data = () => {
  const [ref] = useModuleStyle<HTMLDivElement>();
  const {
    totalPages,
    setPageNumber,
    allSnapshots,
    selectedSnapshotIndex,
    setSelectedSnapshotIndex,
    setSelectedSnapshotId,
    jsonData,
    diffData,
    result,
    setFlag,
    fetchOneGitgraphSnapshot,
  } = useSnapshotsContext();
  return (
    <div ref={ref} className={styles.wrapper}>
      <div className={classNames(styles.explorer)}>
        <div className={classNames(styles.data)}>
          <div data-cy={cyKeys.data.EXPERIMENT_LIST}></div>
          {/*TODO Replace TimelineGraph with DataSection component + delete timeline component from package.json and update package-lock.json*/}
          <TimelineGraph
            allSnapshots={allSnapshots}
            setFlag={setFlag}
            selectedSnapshotIndex={selectedSnapshotIndex}
            setSelectedSnapshotIndex={setSelectedSnapshotIndex}
            setSelectedSnapshotId={setSelectedSnapshotId}
            fetchOneGitgraphSnapshot={fetchOneGitgraphSnapshot}
          />
          <PaginationWrapper numberOfPages={totalPages} setPageNumber={setPageNumber} />
        </div>
        <div className={styles.viewer}>
          {result && <JSONEditor title={"RESULTS"} jsonDataProp={result} height={"100%"} />}
          <div
            style={{
              overflow: "auto",
              flex: 1,
            }}
          >
            {jsonData && !diffData && <JSONEditor title={"QUAM"} jsonDataProp={jsonData} height={"100%"} />}
            {jsonData && diffData && <JSONEditor title={"QUAM"} jsonDataProp={jsonData} height={"66%"} />}
            {jsonData && diffData && <JSONEditor title={"QUAM Updates"} jsonDataProp={diffData} height={"33%"} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default () => (
  <SnapshotsContextProvider>
    <Data />
  </SnapshotsContextProvider>
);
