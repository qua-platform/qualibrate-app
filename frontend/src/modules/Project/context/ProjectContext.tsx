import React, { useCallback, useContext, useEffect, useState } from "react";
import noop from "../../../common/helpers";
import { ProjectViewApi } from "../api/ProjectViewAPI";
import { ProjectDTO } from "../ProjectDTO";

interface IProjectContext {
  allProjects: ProjectDTO[];
  activeProject: ProjectDTO | undefined;
  selectActiveProject: (projectName: ProjectDTO) => void;
}

const ProjectContext = React.createContext<IProjectContext>({
  allProjects: [],
  selectActiveProject: noop,
  activeProject: undefined,
});

export const useProjectContext = (): IProjectContext => useContext<IProjectContext>(ProjectContext);

interface ProjectContextProviderProps {
  children: React.ReactNode;
}

export function ProjectContextProvider(props: ProjectContextProviderProps): React.ReactNode {
  const [activeProject, setActiveProject] = useState<ProjectDTO | undefined>(undefined);
  const [allProjects, setAllProjects] = useState<ProjectDTO[]>([]);

const fetchActiveProject = useCallback(async () => {
  const { isOk, result } = await ProjectViewApi.fetchActiveProject();
  if (isOk && result) {
    setActiveProject(result);
    return result;
  }
  return undefined;
}, []);

const fetchAllProjects = useCallback(async () => {
  const { isOk, result } = await ProjectViewApi.fetchAllProjects();
  if (isOk && result) {
    setAllProjects(result);
    return result;
  }
  return [];
}, []);

useEffect(() => {
  const init = async () => {
    await fetchActiveProject();
    await fetchAllProjects();

    setTimeout(() => {
      if (!activeProject && (!allProjects || allProjects.length === 0)) {
        const fallback: ProjectDTO = {
          name: "My Project",
          created_at: new Date().toISOString(),
          last_modified_at: new Date().toISOString(),
          nodes_number: 1,
        };
        setActiveProject(fallback);
        setAllProjects([fallback]);
      }
    }, 0);
  };
  init();
}, []);

  const selectActiveProject = useCallback((project: ProjectDTO) => {
    setActiveProject(project);
    ProjectViewApi.setActiveProject(project.name);
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        allProjects,
        activeProject,
        selectActiveProject,
      }}
    >
      {props.children}
    </ProjectContext.Provider>
  );
}

export default ProjectContext;
