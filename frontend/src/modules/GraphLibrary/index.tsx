import React from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./GraphLibrary.module.scss";
import { GraphContextProvider, useGraphContext } from "./context/GraphContext";
import { GraphList } from "./components/GraphList";
import { SelectionContextProvider } from "../common/context/SelectionContext";
import BlueButton from "../../ui-lib/components/Button/BlueButton";

const GraphLibrary = () => {
  const { fetchAllCalibrationGraphs } = useGraphContext();

  return (
    <div className={styles.wrapper}>
      <div className={styles.nodesContainer}>
        <div className={styles.searchAndRefresh}>
          {/*<GraphSearch />*/}
          <div className={styles.buttonWrapper}>
            <BlueButton onClick={() => fetchAllCalibrationGraphs(true)}>Refresh</BlueButton>
          </div>
        </div>
        <GraphList />
      </div>
    </div>
  );
};

export default () => (
  <GraphContextProvider>
    <SelectionContextProvider>
      <GraphLibrary />
    </SelectionContextProvider>
  </GraphContextProvider>
);
