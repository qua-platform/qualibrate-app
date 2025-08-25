import React from "react";
import styles from "./Extensions.module.scss";
import StarsIcon from "../../ui-lib/Icons/StarsIcon";
const Extensions: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Extensions</h1>
        <p className={styles.subtitle}>Manage and configure custom extensions for QUAlibrate</p>
      </div>
      
      <div className={styles.content}>
        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}><StarsIcon height={80} width={80} /></div>
          <h2 className={styles.placeholderTitle}>Extensions Coming Soon</h2>
          <p className={styles.placeholderText}>
            The extensions system is currently under development. 
            You'll be able to install and manage custom extensions here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Extensions;
