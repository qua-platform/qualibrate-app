import React, { useEffect } from "react";
import { NodesContextProvider, useNodesContext } from "./context/NodesContext";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "../Nodes/NodesPage.module.scss";
import { NodeElementList } from "./components/NodeElement/NodeElementList";
import { RunningJob } from "./components/RunningJob/RunningJob";
import { Results } from "./components/Results/Results";
import { SelectionContextProvider } from "../common/context/SelectionContext";
import { useFlexLayoutContext } from "../../routing/flexLayout/FlexLayoutContext";
import RefreshIcon from "../../ui-lib/Icons/RefreshIcon";

export const NodesPage = () => {
  const { allNodes, runningNodeInfo, fetchAllNodes } = useNodesContext();
  const { topBarAdditionalComponents, setTopBarAdditionalComponents } = useFlexLayoutContext();
  const NodeTopBarRefreshButton = () => {
    return (
      <div className={styles.refreshButtonWrapper} data-testid="refresh-button">
        <button onClick={() => fetchAllNodes()} title="Refresh node parameters"> <RefreshIcon /> </button>
      </div>
    );
  };
  useEffect(() => {
    setTopBarAdditionalComponents({ ...topBarAdditionalComponents, nodes: <NodeTopBarRefreshButton /> });
  }, []);

  return (
    <div className={styles.wrapper} data-testid="nodes-page-wrapper">
      <div className={styles.nodesAndRunningJobInfoWrapper} data-testid="nodes-and-job-wrapper">
        <div className={styles.nodesContainerTop}>
          <div className={styles.nodeElementListWrapper}>
            <NodeElementList listOfNodes={allNodes} />
          </div>
        </div>
        <div className={styles.nodesContainerDown}>
          <div className={styles.nodeRunningJobInfoWrapper}>
            <RunningJob />
          </div>
          <Results showSearch={false} toggleSwitch={true} pageName={"nodes"} errorObject={runningNodeInfo?.error} />
        </div>
      </div>
    </div>
  );
};

export default () => (
  <NodesContextProvider>
    <SelectionContextProvider>
      <NodesPage />
    </SelectionContextProvider>
  </NodesContextProvider>
);
