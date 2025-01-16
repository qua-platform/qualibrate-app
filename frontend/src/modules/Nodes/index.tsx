import React, { useState } from "react";
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

const NodesPage = () => {
  const heading = "Run calibration node";
  const { allNodes, fetchAllNodes } = useNodesContext();
  const [resultSectionExpanded, setResultSectionExpanded] = useState<boolean>(true);

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrapper}>
        <PageName>{heading}</PageName>
        &nbsp;
        <BlueButton onClick={() => fetchAllNodes()}>Refresh</BlueButton>
      </div>
      <div className={styles.nodesAndRunningJobInfoWrapper}>
        <div className={styles.nodesContainerTop}>
          <div className={styles.nodeElementListWrapper}>
            <NodeElementList listOfNodes={allNodes} />
          </div>
        </div>
        <div className={styles.nodesContainerDown}>
          <div className={styles.nodeRunningJobInfoWrapper}>
            <RunningJob />
          </div>
          <div
            className={resultSectionExpanded ? styles.sliderArrowWrapper : styles.sliderArrowWrapperRotated}
            onClick={() => setResultSectionExpanded(!resultSectionExpanded)}
          >
            <SliderArrowIcon />
          </div>
          <Results showSearch={false} />
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
