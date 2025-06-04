import React, { useCallback } from "react";
import ProjectInfo from "./ProjectInfo";
import { classNames } from "../../../utils/classnames";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./Project.module.scss";
import cyKeys from "../../../utils/cyKeys";
import SelectField from "../../../common/ui-components/common/Input/SelectField";

const SelectRuntime = <SelectField options={["Localhost"]} onChange={() => {}} />;

interface Props {
  showRuntime?: boolean;
  isActive?: boolean;
  onClick?: (name: string) => void;
  projectId?: number;
  name?: string;
}

const Project = ({ showRuntime = false, isActive = false, onClick, name = "", projectId }: Props) => {
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
    <button
      className={classNames(styles.project, isActive && styles.project_active)}
      onClick={handleOnClick}
      data-cy={cyKeys.projects.PROJECT}
    >
      <ProjectInfo name={name} color={projectColor} />
      <div className={styles.projectActions}>{showRuntime && SelectRuntime}</div>
    </button>
  );
};

export default Project;
