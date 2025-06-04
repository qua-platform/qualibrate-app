import { PROJECT_LAST_UPDATES_VISIBLE } from "../../../dev.config";
import React from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./Project.module.scss";
import ProjectFolderIcon from "../../../ui-lib/Icons/ProjectFolderIcon";

interface Props {
  date?: Date;
  name: string;
  color?: string;
}

function extractAbr(text: string): string {
  const parts = [...text.split(" "), "", ""];
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

const ProjectInfo = ({ name, date, color }: Props) => {
  return (
    <div className={styles.projectInfo}>
      <div className={styles.projectThumbnail}>
        <ProjectFolderIcon initials={extractAbr(name)} fillColor={color || "#4A90E2"} width={36} height={36} fontSize={14} />
      </div>
      <div className={styles.projectDetails}>
        <div className={styles.projectName}>{name || ""}</div>
        {PROJECT_LAST_UPDATES_VISIBLE && <div className={styles.projectDate}>Last updates {date?.toLocaleDateString() || "unknown"}</div>}
      </div>
    </div>
  );
};

export default ProjectInfo;
