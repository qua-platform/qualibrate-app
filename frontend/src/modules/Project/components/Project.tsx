import ProjectInfo from "./ProjectInfo";
import { classNames } from "../../../utils/classnames";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./Project.module.scss";
import cyKeys from "../../../utils/cyKeys";
import SelectField from "../../../common/ui-components/common/Input/SelectField";
import { getProjectColor, createClickHandler } from "../helpers";

const SelectRuntime = <SelectField options={["Localhost"]} onChange={() => {}} />;

interface ProjectPropsDTO {
  showRuntime?: boolean;
  isActive?: boolean;
  onClick?: (name: string) => void;
  projectId?: number;
  name?: string;
}

const Project = ({ showRuntime = false, isActive = false, onClick, name = "" }: ProjectPropsDTO) => {
  const handleOnClick = createClickHandler(onClick, name);
  const projectColor = getProjectColor(name || "");

  return (
    <button
      className={classNames(styles.project, isActive && styles.project_active)}
      onClick={handleOnClick}
      data-cy={cyKeys.projects.PROJECT}
    >
      <ProjectInfo name={name} colorIcon={projectColor} />
      <div className={styles.projectActions}>{showRuntime && SelectRuntime}</div>
    </button>
  );
};

export default Project;
