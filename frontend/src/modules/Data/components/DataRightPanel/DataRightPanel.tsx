import React from "react";
import styles from "./DataRightPanel.module.scss";
import { useSelector } from "react-redux";
import { getResult } from "../../../../stores/SnapshotsStore";
import { JSONEditor, VerticalResizableComponent } from "../../../../components";
import { getSelectedSnapshot } from "../../../../stores/SnapshotsStore/selectors";
import { snapshotMetadataToParameters } from "../../../../components/VerticalResizableComponent/helpers";

const DataRightPanel: React.FC = () => {
  const result = useSelector(getResult);
  const selectedSnapshot = useSelector(getSelectedSnapshot);

  return (
    <div className={styles.viewer}>
      <VerticalResizableComponent
        tabData={{
          metadata: snapshotMetadataToParameters(selectedSnapshot?.metadata),
          parameters: selectedSnapshot?.data?.parameters?.model ?? {},
        }}
      />
      {result && <JSONEditor title="RESULTS" jsonDataProp={result} height="100%" />}
    </div>
  );
};
export default DataRightPanel;
