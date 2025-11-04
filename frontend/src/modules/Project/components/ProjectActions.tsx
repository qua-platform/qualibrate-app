import React, { useCallback } from "react";
import ProjectCheckIcon from "../../../ui-lib/Icons/ProjectCheckIcon";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "../Project.module.scss";
import { ProjectDTO } from "../ProjectDTO";
import BlueButton from "../../../ui-lib/components/Button/BlueButton";
import cyKeys from "../../../utils/cyKeys";
import { useFlexLayoutContext } from "../../../routing/flexLayout/FlexLayoutContext";
import { useProjectContext } from "../context/ProjectContext";
import { useSnapshotsContext } from "../../Snapshots/context/SnapshotsContext";
import { NODES_KEY } from "../../../routing/ModulesRegistry";

interface ProjectActionsProps {
  isCurrentProject: boolean;
  projectName: string;
  selectedProject: ProjectDTO | undefined;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({ isCurrentProject, projectName, selectedProject }) => {
  const { openTab } = useFlexLayoutContext();
  const { handleSelectActiveProject } = useProjectContext();
  const { fetchGitgraphSnapshots, pageNumber, setJsonData, setResult, setDiffData } = useSnapshotsContext();

  const handleSubmit = useCallback(async () => {
    if (!selectedProject) return;

    await handleSelectActiveProject(selectedProject as ProjectDTO);
    setJsonData(undefined);
    setResult(undefined);
    setDiffData(undefined);
    fetchGitgraphSnapshots(true, pageNumber);

    openTab(NODES_KEY);
  }, [handleSelectActiveProject, setJsonData, setResult, setDiffData, fetchGitgraphSnapshots, pageNumber, selectedProject]);

  return (
    <div className={styles.pageActions}>
      {selectedProject?.name === projectName && (
        <BlueButton
          onClick={handleSubmit}
          className={styles.actionButton}
          disabled={selectedProject === undefined}
          data-cy={cyKeys.projects.LETS_START_BUTTON}
          data-testid={"lets-start-button-" + projectName}
          isBig
        >
          Let’s Start
        </BlueButton>
      )}
      {isCurrentProject && <ProjectCheckIcon />}
    </div>
  );
};

export default ProjectActions;
