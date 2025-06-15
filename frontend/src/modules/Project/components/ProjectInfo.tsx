import { PROJECT_LAST_UPDATES_VISIBLE } from "../../../dev.config";
import React from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./Project.module.scss";
import ProjectFolderIcon from "../../../ui-lib/Icons/ProjectFolderIcon";
import { extractInitials } from "../helpers";

interface ProjectInfoPropsDTO {
  date?: Date;
  name: string;
  colorIcon?: string;
}

const ProjectInfo = ({ name, date, colorIcon }: ProjectInfoPropsDTO) => {
  return (
    <div className={styles.projectInfo}>
      <div className={styles.projectThumbnail}>
        <ProjectFolderIcon initials={extractInitials(name)} fillColor={colorIcon || "#4A90E2"} width={36} height={36} fontSize={14} />
      </div>
      <div className={styles.projectDetails}>
        <div className={styles.projectName}>{name || ""}</div>
        {PROJECT_LAST_UPDATES_VISIBLE && date && (
          <div className={styles.projectDate}>
            Last updated: {date.toLocaleDateString()} {date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false})}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectInfo;
