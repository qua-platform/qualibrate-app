import React from "react";
import { JSONEditor } from "../../../common/JSONEditor/JSONEditor";
import { useNodesContext } from "../../context/NodesContext";
import styles from "./Results.module.scss";

export const Results: React.FC<{ title?: string; jsonObject?: unknown; showSearch?: boolean; toggleSwitch?: boolean }> = ({
  title,
  jsonObject,
  showSearch = true,
  toggleSwitch = false,
}) => {
  let jsonData = jsonObject;
  if (!jsonObject) {
    const { results } = useNodesContext();
    jsonData = results;
  }

  return (
    <div className={styles.wrapper} data-testid="results-wrapper">
      <JSONEditor
        title={title ?? "Results"}
        jsonDataProp={jsonData ?? {}}
        height={"100%"}
        showSearch={showSearch}
        toggleSwitch={toggleSwitch}
      />
    </div>
  );
};
