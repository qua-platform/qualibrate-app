import React, { useEffect, useState } from "react";
import styles from "./styles/TitleBarMenu.module.scss";
import { useFlexLayoutContext } from "../../routing/flexLayout/FlexLayoutContext";
import modulesMap from "../../routing/ModulesRegistry";
import PageName from "../../common/ui-components/common/Page/PageName";
import TitleBarMenuCard from "./TitleBarMenuCard";
import { NodesApi } from "../Nodes/api/NodesAPI";
import ToggleSwitch from "../../common/ui-components/common/ToggleSwitch/ToggleSwitch";

export interface LastRunStatusNodeResponseDTO {
  status: string;
  run_start: string;
  run_duration: number;
  name: string;
  id?: number;
  percentage_complete: number;
  current_action?: string | null;
  time_remaining: number | null;
}

const TitleBarMenu: React.FC = () => {
  const { activeTab, topBarAdditionalComponents, openTab, graphTab, setGraphTab } = useFlexLayoutContext();
  const [node, setNode] = useState<LastRunStatusNodeResponseDTO | null>(null);

  const handleTabChange = (value: string) => {
    setGraphTab(value);
    if (value === "run") openTab("graph-library");
    else openTab("graph-status");
  };

  const fetchStatus = async () => {
    const res = await NodesApi.fetchLastRunStatusInfo();
    if (res.isOk && res.result?.node) {
      setNode(res.result.node);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => fetchStatus(), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.wrapper}>
      <PageName>{modulesMap[activeTab ?? ""]?.menuItem?.title ?? ""}</PageName>
      
    <div className={styles.ToggleSwitchAndRefreshWrapper}>
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

      <div className={styles.menuCardsWrapper}>
        <TitleBarMenuCard
          node={
            node ?? {
              status: "pending",
              run_start: "",
              run_duration: 0,
              name: "",
              percentage_complete: 0,
              time_remaining: 0,
            }
          }
        />
      </div>
    </div>
  );
};

export default TitleBarMenu;
