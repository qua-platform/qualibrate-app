import React, { useCallback, useState } from "react"; // eslint-disable-next-line css-modules/no-unused-class
import styles from "./styles/TitleBarMenu.module.scss";
import NewProjectButtonIcon from "../../ui-lib/Icons/NewProjectButtonIcon";
import CreateNewProjectForm from "../Project/CreateNewProjectForm/CreateNewProjectForm";

const ProjectTitleBar: React.FC = () => {
  const [showCreateNewProjectForm, setShowCreateNewProjectForm] = useState(false);

  const handleTogglePanel = useCallback(() => {
    setShowCreateNewProjectForm((prev) => !prev);
  }, []);

  const handleCancel = useCallback(() => {
    setShowCreateNewProjectForm(false);
  }, []);

  return (
    <div className={styles.createProjectWrapper}>
      <button title="Create new project" onClick={handleTogglePanel} className={styles.createProjectButton}>
        <NewProjectButtonIcon />
      </button>
      {showCreateNewProjectForm && (
        <div className={styles.createProjectPanelWrapper}>
          <CreateNewProjectForm closeNewProjectForm={handleCancel} />
        </div>
      )}
    </div>
  );
};

export default ProjectTitleBar;
