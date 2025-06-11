import React, { useCallback } from "react";
import ProjectInfo from "./ProjectInfo";
import { classNames } from "../../../utils/classnames";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./Project.module.scss";
import cyKeys from "../../../utils/cyKeys";
import SelectField from "../../../common/ui-components/common/Input/SelectField";
import ProjectCheckIcon from "../../../ui-lib/Icons/ProjectCheckIcon";
import { useProjectContext } from "../context/ProjectContext";
import BlueButton from "../../../ui-lib/components/Button/BlueButton";
import TeamInfoPanel from "./ExpandedContent/TeamInfoPanel";
import ProjectDetailsPanel from "./ExpandedContent/ProjectDetailsPanel";

const SelectRuntime = <SelectField options={["Localhost"]} onChange={() => {}} />;

interface Props {
  showRuntime?: boolean;
  isActive?: boolean;
  onClick?: (name: string) => void;
  name?: string;
  lastModifiedAt?: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}
const Project = ({ showRuntime = false, isActive = false, onClick, name = "", lastModifiedAt, isExpanded, onToggleExpand }: Props) => {

  const { activeProject } = useProjectContext();
  const isCurrentProject = activeProject?.name === name;

  const handleOnClick = useCallback(() => {
    if (!onClick) {
      return;
    }

    onClick(name);
  }, [onClick, name]); // TODO Possible BUG

  const colorPalette = ["#AC51BD", "#5175BD", "#268A50", "#097F8C", "#986800", "#7351BD", "#1268D0"];

  const getColorIndex = (name: string): number => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % colorPalette.length;
  };

  const color = getColorIndex(name || "");
  const projectColor = colorPalette[color];


  return (
    <>
      <button
        className={classNames(
          styles.project,
          isActive && styles.project_active,
          isCurrentProject && styles.project_checked
        )}
        onClick={() => {
          handleOnClick();
          onToggleExpand?.();
        }}
      >
        <ProjectInfo name={name} color={projectColor} date={lastModifiedAt ? new Date(lastModifiedAt) : undefined} />
        <div className={styles.projectActions}>
          <div className={styles.checkWrapper}>
            {isCurrentProject && <ProjectCheckIcon />}
          </div>
          {showRuntime && SelectRuntime}
        </div>
      </button>

      {isExpanded && (
        <div className={styles.projectExpandedContent}>
          <TeamInfoPanel />
          <ProjectDetailsPanel />

            <div className={styles.projectStart}>
              <BlueButton onClick={() => {}} isBig className={styles.expandedStartButton}>
                Let’s Start
              </BlueButton>
          </div>
        </div>
      )}
    </>
  );
};

export default Project;
