/**
 * @fileoverview Main graph library view listing all available calibration workflows.
 *
 * Fetches and displays all graphs from GraphContext. Each graph is rendered as
 * a collapsible GraphElement card with parameters and visualization.
 *
 * @see GraphElement - Individual graph card component
 * @see GraphContext - Provides allGraphs data
 */
import React from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "../GraphLibrary.module.scss";
import { GraphElement } from "./GraphElement/GraphElement";
import { NodeMap } from "../../Nodes/components/NodeElement/NodeElement";
import { useGraphContext } from "../context/GraphContext";
import { InputParameter } from "../../common/Parameters/Parameters";

/**
 * Calibration workflow definition with nodes and connectivity.
 * Represents a DAG of calibration nodes to be executed in sequence.
 */
export interface GraphWorkflow {
  name?: string;
  title?: string;
  description: string;
  parameters?: InputParameter;
  nodes?: NodeMap;
  connectivity?: string[][];
}

export const GraphList: React.FC = () => {
  const { allGraphs } = useGraphContext();
  if (!allGraphs || Object.entries(allGraphs).length === 0) return <div>No calibration graphs</div>;
  return (
    <div className={styles.listWrapper}>
      {Object.entries(allGraphs ?? {}).map(([key, graph]) => {
        return <GraphElement key={key} calibrationGraphKey={key} calibrationGraph={graph} />;
      })}
    </div>
  );
};
