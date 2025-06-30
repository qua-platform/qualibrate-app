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
import { useFlexLayoutContext } from "../../routing/flexLayout/FlexLayoutContext";

const SidebarMenu: React.FunctionComponent = () => {
  const { pinSideMenu } = useContext(GlobalThemeContext) as GlobalThemeContextState;
  const [minify, setMinify] = useState(true);
  const { openTab, graphTab } = useFlexLayoutContext();
  const containerClassName = classNames(styles.sidebarMenu, minify ? styles.collapsed : styles.expanded);

  useEffect(() => {
    setMinify(!pinSideMenu);
  }, [pinSideMenu]);

  const handleHelpClick = () => {
    window.open(
      "https://qua-platform.github.io/qualibrate/"
    );
  }; 

  return (
    <>
    <div className={containerClassName}>
      <button className={styles.qualibrateLogo} data-cy={cyKeys.HOME_PAGE}>
        {minify ? <QUAlibrateLogoSmallIcon /> : <QUAlibrateLogoIcon />}
      </button>

      <div className={styles.menuContent}>
        <div className={styles.menuUpperContent}>
          {menuItems.filter((item) => !item.hidden).map((item, index) => {
            const isGraphMenu = item.keyId === "graph-library";

            const handleClick = () => {
              if (isGraphMenu) { openTab(graphTab === "run" ? "graph-library" : "graph-status"); }
            };
            return (
              <MenuItem {...item} key={index} hideText={minify} data-testid={`menu-item-${index}`} onClick={isGraphMenu ? handleClick : undefined} />
            );
          })}
        </div>

        <div className={styles.menuBottomContent}>
          {bottomMenuItems.map((item) => (
            <MenuItem {...item} key={item.keyId} hideText={minify} onClick={() => {}} />
          ))}
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
