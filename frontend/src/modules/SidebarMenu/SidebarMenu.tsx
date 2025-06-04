import React, { useContext, useEffect, useState } from "react";
import { bottomMenuItems, menuItems } from "../../routing/ModulesRegistry";
import MenuItem from "./MenuItem";
// import { THEME_TOGGLE_VISIBLE } from "../../dev.config";
// import ThemeToggle from "../themeModule/ThemeToggle";
import { classNames } from "../../utils/classnames";
import styles from "./styles/SidebarMenu.module.scss";
import cyKeys from "../../utils/cyKeys";
import GlobalThemeContext, { GlobalThemeContextState } from "../themeModule/GlobalThemeContext";
import QUAlibrateLogoIcon from "../../ui-lib/Icons/QUAlibrateLogoIcon";
import QUAlibrateLogoSmallIcon from "../../ui-lib/Icons/QualibrateLogoSmall";
import { HelpIcon } from "../../ui-lib/Icons/HelpIcon";
import ExpandSideMenuIcon from "../../ui-lib/Icons/ExpandSideMenuIcon";
import CollapseSideMenuIcon from "../../ui-lib/Icons/CollapseSideMenuIcon";
import ProjectFolderIcon from "../../ui-lib/Icons/ProjectFolderIcon";
import { useFlexLayoutContext } from "../../routing/flexLayout/FlexLayoutContext";
import { useProjectContext } from "../Project/context/ProjectContext";

const SidebarMenu: React.FunctionComponent = () => {
  const { pinSideMenu } = useContext(GlobalThemeContext) as GlobalThemeContextState;
  const [minify, setMinify] = useState(true);

  const containerClassName = classNames(styles.sidebarMenu, minify ? styles.collapsed : styles.expanded);

  useEffect(() => {
    setMinify(!pinSideMenu);
  }, [pinSideMenu]);

  const handleHelpClick = () => {
    window.open(
      "https://qua-platform.github.io/qualibrate/"
    );
  }; 

  const { activeProject } = useProjectContext();
  // console.log("Sidebar sees active project:", activeProject);

  const extractInitials = (name?: string): string => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  };

  const colorPalette = ["#AC51BD", "#5175BD", "#268A50", "#097F8C", "#986800", "#7351BD", "#1268D0"];
  const getColorIndex = (name: string): number => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % colorPalette.length;
  };

  const color = getColorIndex(activeProject?.name || "");
  const projectColor = colorPalette[color];

  const { openTab } = useFlexLayoutContext();

  const handleProjectClick = () => {
    openTab("project");
  };

  return (
    <>
    <div className={containerClassName}>
      <button className={styles.qualibrateLogo} data-cy={cyKeys.HOME_PAGE}>
        {minify ? <QUAlibrateLogoSmallIcon /> : <QUAlibrateLogoIcon />}
      </button>

      <div className={styles.menuContent}>
        <div className={styles.menuUpperContent}>
          {menuItems.map((item, index) => (
            <MenuItem {...item} key={index} hideText={minify} data-testid={`menu-item-${index}`} />
          ))}
        </div>

        <div className={styles.menuBottomContent}>
          {bottomMenuItems.map((item) => (
            <MenuItem {...item} key={item.keyId} hideText={minify} onClick={() => {}} />
          ))}
          {activeProject?.name && (
            <MenuItem
              menuItem={{
                title: activeProject.name,
                icon: () => (
                  <ProjectFolderIcon
                    initials={extractInitials(activeProject?.name)}
                    fillColor={projectColor}
                    width={28}
                    height={28}
                    fontSize={13}
                  />
                ),
                dataCy: "active-project",
              }}
              keyId={"active-project"}
              hideText={minify}
              onClick={handleProjectClick}
            />
          )}
          <MenuItem 
            menuItem={{ title: "Help", icon: HelpIcon, dataCy: "help-btn" }} 
            keyId="help" 
            hideText={minify} 
            onClick={handleHelpClick} 
          />
          {/* {THEME_TOGGLE_VISIBLE && (
            <div className={styles.menuBottomContent}>
              <ThemeToggle showText={!minify} />
            </div>
          )} */}
          <MenuItem
            menuItem={{
              icon: minify ? ExpandSideMenuIcon : CollapseSideMenuIcon,
              dataCy: "toggle-sidebar",
            }}
            keyId="toggle"
            hideText={minify}
            onClick={() => setMinify(!minify)}
          />
        </div>
      </div>
    </div>
    </>
  );
};

export default SidebarMenu;
