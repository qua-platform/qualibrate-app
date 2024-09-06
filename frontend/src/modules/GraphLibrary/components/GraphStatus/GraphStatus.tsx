import React from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./GraphStatus.module.scss";
import { GraphStatusContextProvider, useGraphStatusContext } from "./context/GraphStatusContext";
import PageName from "../../../../DEPRECATED_components/common/Page/PageName";
import { Results } from "../../../Nodes/components/Results/Results";
import { MeasurementHistory } from "./components/MeasurementHistory/MeasurementHistory";
import { MeasurementElementGraph } from "./components/MeasurementElementGraph/MeasurementElementGraph";
import { SelectionContextProvider } from "../../../common/context/SelectionContext";
import { GraphContextProvider } from "../../context/GraphContext";

const GraphStatus = () => {
  const heading = "Run calibration graph";
  const { allMeasurements, selectedMeasurement, result, diffData } = useGraphStatusContext();

  // useEffect(() => {
  //   console.log("aaaa", selectedMeasurement);
  //   a();
  // }, [selectedMeasurement]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.upperContainer}>
        <div className={styles.titleWrapper}>
          <PageName>{heading}</PageName>
        </div>
        <MeasurementElementGraph />
        <MeasurementHistory listOfMeasurements={allMeasurements} />
      </div>
      <div className={styles.resultsContainer}>
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