import React from "react";
import { JSONEditor } from "../../../Data";
import { useNodesContext } from "../../context/NodesContext";
import styles from "./Results.module.scss";

export const Results: React.FC<{ title?: string; jsonObject?: unknown }> = ({ title, jsonObject }) => {
  let jsonData = jsonObject;
  if (!jsonObject) {
    const { results } = useNodesContext();
    jsonData = results;
  }

  return (
    <div className={styles.wrapper}>
      <JSONEditor title={title ?? "Results"} jsonDataProp={jsonData ?? {}} height={"100%"} />
    </div>
  );
};
