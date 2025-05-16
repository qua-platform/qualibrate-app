import React from "react";
import styles from "../styles/FeedbackHeader.module.scss";

interface FeedbackHeaderProps {
  closing: boolean;
  onBackdropClick: () => void;
  onModalClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const FeedbackHeader: React.FC<FeedbackHeaderProps> = ({ closing, onBackdropClick, onModalClick }) => {
  return (
    <div className={styles.backdrop} onClick={onBackdropClick}>
      <div
        className={`${styles.modal} ${closing ? styles.closing : ""}`}
        onClick={onModalClick}
      >
        <h2>Feedback</h2>
      </div>
    </div>
  );
};

export default FeedbackHeader;
