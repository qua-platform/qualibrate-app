import React from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./GraphStatus.module.scss";
import { GraphStatusContextProvider, useGraphStatusContext } from "./context/GraphStatusContext";
import PageName from "../../../../DEPRECATED_components/common/Page/PageName";
import { Results } from "../../../Nodes/components/Results/Results";
import { MeasurementHistory } from "./components/MeasurementHistory/MeasurementHistory";
import { MeasurementElementGraph } from "./components/MeasurementElementGraph/MeasurementElementGraph";
import { SelectionContextProvider } from "../../../common/context/SelectionContext";
import { GraphContextProvider, useGraphContext } from "../../context/GraphContext";

const GraphStatus = () => {
  const heading = "Run calibration graph";
  const { workflowGraphElements } = useGraphContext();
  const { allMeasurements, result, diffData } = useGraphStatusContext();

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftContainer}>
        <div className={styles.headingWrapper}>
          <PageName>{heading}</PageName>
        </div>
        <div className={styles.graphAndHistoryWrapper}>
          {workflowGraphElements && <MeasurementElementGraph workflowGraphElements={workflowGraphElements} />}
          <MeasurementHistory listOfMeasurements={allMeasurements} />
        </div>
      </div>
      <div className={styles.rightContainer}>
        <Results jsonObject={result} />
        <Results title={"QuAM"} jsonObject={diffData} />
      </div>
    </div>
  );
};

export default () => (
  <GraphContextProvider>
    <GraphStatusContextProvider>
      <SelectionContextProvider>
        <GraphStatus />
      </SelectionContextProvider>
    </GraphStatusContextProvider>
  </GraphContextProvider>
);
