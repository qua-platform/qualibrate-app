import React from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "../RunningJob/RunningJob.module.scss";
import { RunningNodeInfo } from "../../context/NodesContext";
import { RightArrowIcon } from "../../../../ui-lib/Icons/RightArrowIcon";

interface Props {
  runningNodeInfo: RunningNodeInfo | undefined;
}

const StateUpdatesListPreview: React.FC<Props> = ({
  runningNodeInfo,
}) => {
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

export default StateUpdatesListPreview;
