import ProjectInfo from "./ProjectInfo";
import { classNames } from "../../../utils/classnames";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./Project.module.scss";
import cyKeys from "../../../utils/cyKeys";
import SelectField from "../../../common/ui-components/common/Input/SelectField";
import ProjectCheckIcon from "../../../ui-lib/Icons/ProjectCheckIcon";
import { useProjectContext } from "../context/ProjectContext";
import { getColorIndex, createClickHandler } from "../helpers";
import { colorPalette } from "../constants";

const SelectRuntime = <SelectField options={["Localhost"]} onChange={() => {}} />;

interface ProjectPropsDTO {
  showRuntime?: boolean;
  isActive?: boolean;
  onClick?: (name: string) => void;
  projectId?: number;
  name?: string;
  lastModifiedAt?: string;
}

const Project = ({ showRuntime = false, isActive = false, onClick, name = "", lastModifiedAt }: ProjectPropsDTO) => {
  const { activeProject } = useProjectContext();
  const isCurrentProject = activeProject?.name === name;

  const handleOnClick = createClickHandler(onClick, name);
  const projectColor = colorPalette[getColorIndex(name)];

  return (
    <button
      className={classNames(
        styles.project,
        isActive && styles.project_active,
        isCurrentProject && styles.project_checked
      )}
      onClick={handleOnClick}
      data-cy={cyKeys.projects.PROJECT}
    >
      <ProjectInfo name={name} colorIcon={projectColor} date={lastModifiedAt ? new Date(lastModifiedAt) : undefined} />
      <div className={styles.projectActions}>
        <div className={styles.checkWrapper}>
          {isCurrentProject && <ProjectCheckIcon />}
        </div>
        {showRuntime && SelectRuntime}
      </div>
    </button>
  );
};

export default Project;
