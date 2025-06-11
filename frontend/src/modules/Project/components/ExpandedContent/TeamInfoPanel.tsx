import React from "react";
import styles from "../Project.module.scss";

const mockContributors = [
  { initial: 'W', color: '#f97316', name: 'Wilfred Abbott' },
  { initial: 'D', color: '#3b82f6', name: 'Daisy Carter' },
  { initial: 'O', color: '#10b981', name: 'Oman Lee' },
  { initial: 'I', color: '#a855f7', name: 'Isabel Zhou' },
];

const TeamInfoPanel: React.FC = () => {
  return (
    <div className={styles.expandedPanel}>
      <div className={styles.teamInfoCard}>
        <div className={styles.teamRow}>
          <div className={styles.teamLabel}>Created by:</div>
          <div className={styles.avatarWithName}>
            <div className={styles.avatar} style={{ backgroundColor: '#d97706' }}>W</div>
            <span className={styles.creatorName}>Wilfred Abbott</span>
          </div>
        </div>

        <div className={styles.teamRow}>
          <div className={styles.teamLabel}>Active contributors:</div>
          <div className={styles.contributorsGroup}>
            {mockContributors.map((user, idx) => (
              <div key={idx} className={styles.contributor} title={user.name}>
                <div className={styles.avatar} style={{ backgroundColor: user.color }}>
                  {user.initial}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamInfoPanel;
