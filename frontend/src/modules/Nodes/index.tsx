import React from "react";
import { NodesContextProvider, useNodesContext } from "./context/NodesContext";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "../Nodes/NodesPage.module.scss";
import { NodeElementList } from "./components/NodeElement/NodeElementList";
import { RunningJob } from "./components/RunningJob/RunningJob";
import { Results } from "./components/Results/Results";
import { SelectionContextProvider } from "../common/context/SelectionContext";
import PageName from "../../common/ui-components/common/Page/PageName";
import BlueButton from "../../ui-lib/components/Button/BlueButton";
import { SliderArrowIcon } from "../../ui-lib/Icons/SliderArrowIcon";
import { classNames } from "../../utils/classnames";

const NodesPage = () => {
  const heading = "Run calibration node";
  const { allNodes, fetchAllNodes } = useNodesContext();
  const [resultsExpanded, setResultsExpanded] = React.useState(true);

  return (
    <div className={styles.wrapper} data-testid="nodes-page-wrapper">
      <div className={styles.titleWrapper} data-testid="title-wrapper">
        <PageName>{heading}</PageName>
        &nbsp;
        <BlueButton onClick={() => fetchAllNodes()} data-testid="refresh-button">
          Refresh
        </BlueButton>
      </div>
      <div className={styles.nodesAndRunningJobInfoWrapper} data-testid="nodes-and-job-wrapper">
        <div className={styles.nodesContainerTop}>
          <div className={styles.nodeElementListWrapper}>
            <NodeElementList listOfNodes={allNodes} />
          </div>
        </div>
        <div className={styles.nodesContainerDown}>
          <div className={styles.nodeRunningJobInfoWrapper}>
            <div>
              <RunningJob expanded={resultsExpanded} />
            </div>
            <div className={styles.sliderArrowWrapper}>
              <div
                className={classNames(resultsExpanded && styles.sliderArrowRotated)}
                onClick={() => setResultsExpanded(!resultsExpanded)}
              >
                <SliderArrowIcon />
              </div>
            </div>
          </div>
          <Results showSearch={false} toggleSwitch={true} />
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
