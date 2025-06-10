import LoadingBar from "../../../ui-lib/loader/LoadingBar";
import { NoItemsIcon } from "../../../ui-lib/Icons/NoItemsIcon";
import Project from "./Project";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./Project.module.scss";
import React from "react";
import { ProjectDTO } from "../ProjectDTO";

interface Props {
  projects: ProjectDTO[];
  selectedProject: ProjectDTO | undefined;
  setSelectedProject: React.Dispatch<React.SetStateAction<ProjectDTO | undefined>>;
}

const ProjectList = ({ projects, selectedProject, setSelectedProject }: Props) => {
  if (!projects?.length) {
    return (
      <div className={styles.splash}>
        <LoadingBar icon={<NoItemsIcon />} text="No projects yet" />
      </div>
    );
  }

  return (
    <div className={styles.splash}>
      {[...projects]
        .sort((a, b) => new Date(b.last_modified_at).getTime() - new Date(a.last_modified_at).getTime())
        .map((project, index) => (
        <React.Fragment key={index}>
          <Project
            isActive={selectedProject?.name === project.name}
            name={project.name}
            onClick={() => setSelectedProject(project)}
            lastModifiedAt={project.last_modified_at}
          />
          {index < projects.length - 1 && <div className={styles.projectDivider} />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProjectList;
