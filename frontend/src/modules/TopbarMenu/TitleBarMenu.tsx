import React, { useEffect, useState } from "react";
import styles from "./styles/TitleBarMenu.module.scss";
import { useFlexLayoutContext } from "../../routing/flexLayout/FlexLayoutContext";
import modulesMap from "../../routing/ModulesRegistry";
import PageName from "../../common/ui-components/common/Page/PageName";
import TitleBarMenuCard from "./TitleBarMenuCard";
import { useWebSocketData } from "../../contexts/WebSocketContext";

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
  const { runStatus } = useWebSocketData();
  const { activeTab, topBarAdditionalComponents } = useFlexLayoutContext();
  const [node, setNode] = useState<LastRunStatusNodeResponseDTO | null>(null);


  useEffect(() => {
    if (runStatus && runStatus.node) {
      setNode(runStatus.node);
    }
  }, [runStatus]);

  return (
    <div className={styles.wrapper}>
      <PageName>{modulesMap[activeTab ?? ""]?.menuItem?.title ?? ""}</PageName>
      {topBarAdditionalComponents && topBarAdditionalComponents[activeTab ?? ""]}

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
