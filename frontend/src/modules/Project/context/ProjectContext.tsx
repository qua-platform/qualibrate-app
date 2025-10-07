import React, { useCallback, useContext, useEffect, useState } from "react";
import noop from "../../../common/helpers";
import { ProjectViewApi } from "../api/ProjectViewAPI";
import { ProjectDTO } from "../ProjectDTO";

interface IProjectContext {
  allProjects: ProjectDTO[];
  setAllProjects: (projects: ProjectDTO[]) => void;
  handleSelectActiveProject: (projectName: ProjectDTO) => void;
  activeProject: ProjectDTO | null | undefined;
  shouldGoToProjectPage: boolean;
  isScanningProjects: boolean;
  fetchProjectsAndActive: () => void;
}

const ProjectContext = React.createContext<IProjectContext>({
  allProjects: [],
  setAllProjects: noop,
  handleSelectActiveProject: noop,
  activeProject: undefined,
  shouldGoToProjectPage: true,
  isScanningProjects: false,
  fetchProjectsAndActive: noop,
});

export const useProjectContext = (): IProjectContext => useContext<IProjectContext>(ProjectContext);

export const ProjectContextProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [activeProject, setActiveProject] = useState<ProjectDTO | null | undefined>(undefined);
  const [shouldGoToProjectPage, setShouldGoToProjectPage] = useState<boolean>(true);
  const [allProjects, setAllProjects] = useState<ProjectDTO[]>([]);
  const [isScanningProjects, setIsScanningProjects] = useState<boolean>(false);

  const fetchProjectsAndActive = async () => {
    setIsScanningProjects(true);
    try {
      const [projectsRes, activeNameRes] = await Promise.all([ProjectViewApi.fetchAllProjects(), ProjectViewApi.fetchActiveProjectName()]);

      if (projectsRes.isOk && projectsRes.result) {
        const fetchedProjects = projectsRes.result;
        setAllProjects(fetchedProjects);
        if (activeNameRes.isOk && activeNameRes.result) {
          const fetchedActiveProject = fetchedProjects.find((p) => p.name === activeNameRes.result);
          setActiveProject(fetchedActiveProject);
        }
      }
    } catch (error) {
      console.error("Error fetching projects or active project:", error);
    }
    setIsScanningProjects(false);
  };

  const fetchShouldRedirectUserToProjectPage = async () => {
    try {
      const response = await ProjectViewApi.fetchShouldRedirectUserToProjectPage();

      if (response.isOk && response.result) {
        localStorage.setItem("backandWorking", "true");
        setShouldGoToProjectPage(response.result.page === "project");
      }
    } catch (error) {
      console.error("Error fetching should user be redirected to project page:", error);
    }
  };

  useEffect(() => {
    fetchShouldRedirectUserToProjectPage();
    fetchProjectsAndActive();
  }, []);

  const handleSelectActiveProject = useCallback(
    async (project: ProjectDTO) => {
      try {
        const { isOk, result } = await ProjectViewApi.selectActiveProject(project.name);
        if (isOk && result === project.name) {
          setActiveProject(project);
        }
      } catch (err) {
        console.error("Failed to activate project:", err);
      }
    },
    [setActiveProject]
  );

  return (
    <ProjectContext.Provider
      value={{
        allProjects,
        setAllProjects,
        activeProject,
        shouldGoToProjectPage,
        handleSelectActiveProject,
        isScanningProjects,
        fetchProjectsAndActive,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
