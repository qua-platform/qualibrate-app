import React from "react";
import NoNodeRunningIcon from "../../../../ui-lib/Icons/NoNodeRunningIcon";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "../RunningJob/RunningJob.module.scss";

interface EmptyStateOverlayProps {
  title: string;
  message: string;
  iconSize?: number;
}

export const EmptyStateOverlay: React.FC<EmptyStateOverlayProps> = ({ 
  title, 
  message, 
  iconSize = 30 
}) => {
  return (
    <div className={styles.emptyStateWrapper}>
      <div className={styles.emptyStateIcon}>
        <NoNodeRunningIcon height={iconSize} width={iconSize} />
      </div>
      <div className={styles.emptyStateTitle}>
        No {title} Available
      </div>
      <div className={styles.emptyStateDescription}>
        {message}
      </div>
    </div>
  );
};
