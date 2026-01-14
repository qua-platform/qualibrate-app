import React from "react";
import { SnapshotDTO } from "../../../../stores/SnapshotsStore";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./ExecutionCard.module.scss";
import { classNames } from "../../../../utils/classnames";
import { formatDateTime } from "../../../../utils/formatDateTime";
import { formatTimeDuration } from "../../../../utils/formatTimeDuration";

const ExecutionCard: React.FC<{ snapshot: SnapshotDTO; isSelected: boolean; handleOnClick: () => void }> = ({
  snapshot,
  isSelected,
  handleOnClick,
}) => {
  const statusClassMap: Record<string, string> = {
    running: styles.statusRunning,
    pending: styles.statusPending,
    success: styles.statusSuccess,
    error: styles.statusError,
  };

  const statusDotClassMap: Record<string, string> = {
    running: styles.statusDotRunning,
    pending: styles.statusDotPending,
    success: styles.statusDotSuccess,
    error: styles.statusDotError,
  };
  const executionId = snapshot.id;
  const executionName = snapshot.metadata?.name;
  const executionStatus = snapshot.metadata?.status ?? "pending"; // TODO Fix this
  const runStart = snapshot.metadata?.run_start;
  const runDuration = snapshot.metadata?.run_duration ?? 0;

  return (
    <div className={classNames(styles.executionCard, isSelected && styles.selected)} onClick={handleOnClick}>
      <div className={styles.executionHeader}>
        <div className={styles.executionHeaderLeft}>
          <span className={styles.executionName}>{executionName}</span>
        </div>
        <div className={classNames(styles.executionStatus, statusClassMap[executionStatus])}>
          <div className={classNames(styles.statusDot, statusDotClassMap[executionStatus])} />
          {executionStatus}
        </div>
      </div>
      <div className={styles.executionMeta}>
        <div className={styles.executionMetaItem}>
          <span className={styles.executionId}>#{executionId}</span>
        </div>
        <div className={styles.executionMetaItem}>
          {/*TODO Extract to an Icon*/}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {formatTimeDuration(runDuration)}
        </div>
        <div className={styles.executionMetaItem}>
          {/*TODO Extract to an Icon*/}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {runStart && formatDateTime(runStart)}
        </div>
      </div>

      {/*<div className={styles.executionTags}>*/}
      {/*  /!*<div className="tag">*!/*/}
      {/*  /!*  <div className={styles.tagDot} />*!/*/}
      {/*  /!*  /!*background: #58a6ff;*!/*!/*/}
      {/*  /!*  resonance*!/*/}
      {/*  /!*</div>*!/*/}

      {/*  /!*<div className={styles.tag}>*!/*/}
      {/*  /!*  <div className={styles.tagDot} />*!/*/}
      {/*  /!*  /!*background: #3fb950;*!/*!/*/}
      {/*  /!*  characterization*!/*/}
      {/*  /!*</div>*!/*/}

      {/*  <button className={styles.addTagButton} onClick={handleOnAddTagClick}>*/}
      {/*    + Tag*/}
      {/*  </button>*/}
      {/*</div>*/}
    </div>
  );
};
export default ExecutionCard;
