import React from "react";
import styles from "../Project.module.scss";

const ProjectDetailsPanel: React.FC = () => {
  return (
      <div className={styles.projectDetailsGrid}>
        <div className={styles.detailLabel}>Data path</div>
        <div className={styles.detailValue}>#/qubits/q2/resonator/frequency</div>

        <div className={styles.detailLabel}>QUAM state path</div>
        <div className={styles.detailValue}>#/qubits/q2/resonator/frequency</div>

        <div className={styles.detailLabel}>Number of datasets</div>
        <div className={styles.detailValue}>3</div>

        <div className={styles.detailLabel}>First dataset</div>
        <div className={styles.detailValue}>10/11/2025 13:10:30</div>

        <div className={styles.detailLabel}>Last dataset</div>
        <div className={styles.detailValue}>10/11/2025 13:10:30</div>

        <div className={styles.detailLabel}>Description</div>
        <div className={styles.detailValue}>
          Feugiat fusce ullamcorper laoreet nec quisque fames nulla at risus lobortis ullamcorper.
        </div>
      </div>
  );
};

export default ProjectDetailsPanel;
