import React from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./GraphStatus.module.scss";
import { GraphStatusContextProvider, useGraphStatusContext } from "./context/GraphStatusContext";
import { Results } from "../../../Nodes/components/Results/Results";
import { MeasurementHistory } from "./components/MeasurementHistory/MeasurementHistory";
import { MeasurementElementGraph } from "./components/MeasurementElementGraph/MeasurementElementGraph";
import { SelectionContextProvider, useSelectionContext } from "../../../common/context/SelectionContext";
import { GraphContextProvider, useGraphContext } from "../../context/GraphContext";
import PageName from "../../../../common/ui-components/common/Page/PageName";

const GraphStatus = () => {
  const heading = "Run calibration graph";
  const { setSelectedItemName } = useSelectionContext();
  const { workflowGraphElements } = useGraphContext();
  const { allMeasurements, result, diffData, fetchResultsAndDiffData, setResult, setDiffData } = useGraphStatusContext();

  const getMeasurementId = (measurementName: string) => {
    return allMeasurements?.find((measurement) => measurement.name === measurementName)?.snapshot_idx;
  };
  const handleOnCytoscapeNodeClick = (name: string) => {
    setSelectedItemName(undefined);
    const measurementId = getMeasurementId(name);
    if (measurementId) {
      setSelectedItemName(name);
      fetchResultsAndDiffData(measurementId);
    } else {
      setResult({});
      setDiffData({});
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftContainer}>
        <div className={styles.headingWrapper}>
          <PageName>{heading}</PageName>
        </div>
        <div className={styles.graphAndHistoryWrapper}>
          {workflowGraphElements && (
            <MeasurementElementGraph workflowGraphElements={workflowGraphElements} onCytoscapeNodeClick={handleOnCytoscapeNodeClick} />
          )}
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
