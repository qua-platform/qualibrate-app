import React from "react";
import styles from "./styles/TitleBarMenu.module.scss";
import { useFlexLayoutContext } from "../../routing/flexLayout/FlexLayoutContext";
import modulesMap from "../../routing/ModulesRegistry";
import PageName from "../../common/ui-components/common/Page/PageName";
import TitleBarGraphCard from "./TitleBarGraphCard/TitleBarGraphCard";
import ToggleSwitch from "../../common/ui-components/common/ToggleSwitch/ToggleSwitch";

const TitleBarMenu: React.FC = () => {
  const { activeTab, topBarAdditionalComponents, openTab, graphTab, setGraphTab } = useFlexLayoutContext();

  const handleTabChange = (value: string) => {
    setGraphTab(value);
    if (value === "run") openTab("graph-library");
    else openTab("graph-status");
  };
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.topBarRow}>
        <div className={styles.titleAndControls}>
          <PageName>{modulesMap[activeTab ?? ""]?.menuItem?.title ?? ""}</PageName>

          {(activeTab === "graph-library" || activeTab === "graph-status") && (
            <ToggleSwitch
              activeTab={graphTab}
              setActiveTab={handleTabChange}
              options={[
                { label: "Run graph", value: "run" },
                { label: "Active graph", value: "active" },
              ]}
            />
          )}

          {topBarAdditionalComponents && topBarAdditionalComponents[activeTab ?? ""]}
        </div>
      </div>

      <div className={styles.menuCardsWrapper}>
        <TitleBarGraphCard />
      </div>
    </div>
  );
};

export default TitleBarMenu;
