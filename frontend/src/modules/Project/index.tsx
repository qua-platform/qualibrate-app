import styles from "./Index.module.scss";
import { NEW_PROJECT_BUTTON_VISIBLE } from "../../dev.config";
import { ACTIVE_TEXT } from "../../utils/colors";
import { AddIcon } from "../../ui-lib/Icons/AddIcon";
import BlueButton from "../../ui-lib/components/Button/BlueButton";
import { IconType } from "../../common/interfaces/InputProps";
import { SearchIcon } from "../../ui-lib/Icons/SearchIcon";
import React, { useEffect, useState } from "react";
import ProjectList from "./components/ProjectList";
import { useProjectContext } from "./context/ProjectContext";
import cyKeys from "../../utils/cyKeys";
import { useFlexLayoutContext } from "../../routing/flexLayout/FlexLayoutContext";
import LoaderPage from "../../ui-lib/loader/LoaderPage";
import { ProjectDTO } from "./ProjectDTO";
import PageName from "../../common/ui-components/common/Page/PageName";
import PageSection from "../../common/ui-components/common/Page/PageSection";
import InputField from "../../common/ui-components/common/Input/InputField";
import CreateNewProjectIcon from "../../ui-lib/Icons/NewProjectButtonIcon";
import CreateNewProjectPanel from "./CreateNewProjectPanel/CreateNewProjectPanel";
import CalandarProjectIcon from "../../ui-lib/Icons/CalandarProjectIcon";
import FavoriteIcon from "../../ui-lib/Icons/FavoriteIcon";

const Project = () => {
  const { openTab } = useFlexLayoutContext();
  const { allProjects, activeProject, selectActiveProject } = useProjectContext();
  const [listedProjects, setListedProjects] = useState<ProjectDTO[] | undefined>(allProjects);
  const [selectedProject, setSelectedProject] = useState<ProjectDTO | undefined>(undefined);
  const [showCreatePanel, setShowCreatePanel] = useState(false);

  useEffect(() => {
    setListedProjects(allProjects);
  }, [allProjects, setListedProjects]);

  const handleSubmit = () => {
    const fallbackProject = allProjects[0];
    selectActiveProject(selectedProject || fallbackProject);
    // in future maybe expand project details instead of just opening data tab
    openTab("data");
  };

  if (!activeProject) {
    return <LoaderPage />;
  }

  const heading: string = activeProject?.name ? "" : "Welcome to QUAlibrate";

  return (
    <>
      <div className={styles.projectPageLayout}>
        <div className={styles.createProjectWrapper}>
          <button title="Create new project" onClick={() => setShowCreatePanel(prev => !prev)} className={styles.createProjectButton}>
            <CreateNewProjectIcon />
          </button>
          {showCreatePanel && (
            <div className={styles.createProjectPanelWrapper}>
              <CreateNewProjectPanel onCancel={() => setShowCreatePanel(false)} />
            </div>
          )}
        </div>

        <PageName>{heading}</PageName>
        <div className={styles.pageWrapper}>
          <PageSection sectionName="Please select a Project">
            <div className={styles.searchWithIconsWrapper}>
              <InputField
                iconType={IconType.INNER}
                placeholder="Project Name"
                className={styles.searchProjectField}
                onChange={(f) => setListedProjects(allProjects.filter((p) => p.name.startsWith(f)))}
                icon={<SearchIcon height={18} width={18} />}
              />
              <div className={styles.IconsWrapper}>
                <button className={styles.iconButton} title="Calendar" onClick={() => {
                  // TODO: handle calendar icon click
                  // This could open a calendar view and select a date range for the project
                    // This searches for projects based on the selected date range by last modified date
                }}>
                  <CalandarProjectIcon />
                </button>
                <button className={styles.iconButton} title="Favorite" onClick={() => {
                  // TODO: handle favorite icon click
                  // This could toggle the favorite status of a selected project
                  // and filter the project list to show only favorites
                    // This searches for projects based on the favorite status
                }}>
                  <FavoriteIcon />
                </button>
              </div>
            </div>
            <div className={styles.projectSearchBarDivider} />
            {listedProjects && (
              <ProjectList projects={listedProjects} selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
            )}
          </PageSection>
        </div>
      </div>
      <div className={styles.pageActions}>
        <BlueButton
          onClick={handleSubmit}
          className={styles.actionButton}
          disabled={selectedProject === undefined}
          data-cy={cyKeys.projects.LETS_START_BUTTON}
          isBig
        >
          Let’s Start
        </BlueButton>

        {NEW_PROJECT_BUTTON_VISIBLE && (
          <BlueButton isSecondary className={styles.actionButton}>
            <AddIcon height={12} color={ACTIVE_TEXT} />
            New project
          </BlueButton>
        )}
      </div>
    </>
  );
};

export default () => (
    <Project />
);
