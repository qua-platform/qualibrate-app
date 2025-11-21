/**
 * @fileoverview Collapsible graph workflow card with parameters and visualization.
 *
 * Displays a calibration graph with editable parameters, node details, and a
 * Cytoscape preview. Handles parameter transformation for API submission and
 * opens the graph-status panel when execution starts.
 *
 * @see GraphList - Renders multiple GraphElements
 * @see CytoscapeGraph - Embedded graph visualization
 * @see GraphContext - Manages graph selection and execution state
 */
import React, { useState } from "react";
import { useSelector } from "react-redux";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./GraphElement.module.scss";
import { classNames } from "../../../../utils/classnames";
import { InputParameter, Parameters, SingleParameter } from "../../../common/Parameters/Parameters";
import { GraphWorkflow } from "../GraphList";
import { Checkbox } from "@mui/material";
import { ParameterList } from "../../../common/Parameters/ParameterList";
import CytoscapeGraph from "../CytoscapeGraph/CytoscapeGraph";
import { GraphLibraryApi } from "../../api/GraphLibraryApi";
import { NodeDTO } from "../../../Nodes/components/NodeElement/NodeElement";
import { GraphElementErrorWrapper } from "../GraphElementErrorWrapper/GraphElementErrorWrapper";
import BlueButton from "../../../../ui-lib/components/Button/BlueButton";
import InputField from "../../../../common/ui-components/common/Input/InputField";
import { GRAPH_STATUS_KEY } from "../../../../routing/ModulesRegistry";
import { getAllGraphs, getSelectedWorkflowName } from "../../../../stores/GraphStores/GraphLibrary/selectors";
import {
  fetchWorkflowGraph,
  setAllGraphs,
  setLastRunActive,
  setSelectedWorkflowName,
} from "../../../../stores/GraphStores/GraphLibrary/actions";
import { useRootDispatch } from "../../../../stores";
import { getWorkflowGraphElements } from "../../../../stores/GraphStores/GraphCommon/selectors";
import { setActivePage } from "../../../../stores/NavigationStore/actions";

interface ICalibrationGraphElementProps {
  calibrationGraphKey?: string;
  calibrationGraph: GraphWorkflow;
}

/**
 * Transformed graph structure for API submission.
 * Flattens parameter defaults from InputParameter format to simple key-value pairs.
 */
export interface TransformedNode {
  parameters: {
    [key: string]: string | number | boolean | undefined;
  };
  nodes?: TransformedNodeMap;
}

export interface TransformedNodeMap {
  [key: string]: TransformedNode;
}

export interface TransformedGraph {
  parameters: {
    [key: string]: string | number | boolean | undefined;
  };
  nodes: TransformedNodeMap;
}

export const GraphElement: React.FC<ICalibrationGraphElementProps> = ({ calibrationGraphKey, calibrationGraph }) => {
  const [errorObject, setErrorObject] = useState<unknown>(undefined);
  const dispatch = useRootDispatch();
  const workflowGraphElements = useSelector(getWorkflowGraphElements);
  const allGraphs = useSelector(getAllGraphs);
  const selectedWorkflowName = useSelector(getSelectedWorkflowName);

  const updateParameter = (paramKey: string, newValue: boolean | number | string, workflow?: NodeDTO | GraphWorkflow) => {
    const updatedParameters = {
      ...workflow?.parameters,
      [paramKey]: {
        ...(workflow?.parameters as InputParameter)[paramKey],
        default: newValue,
      },
    };

    if (selectedWorkflowName && allGraphs?.[selectedWorkflowName]) {
      const updatedWorkflow = {
        ...allGraphs[selectedWorkflowName],
        parameters: updatedParameters,
      };

      const updatedCalibrationGraphs = {
        ...allGraphs,
        [selectedWorkflowName]: updatedWorkflow,
      };

      dispatch(setAllGraphs(updatedCalibrationGraphs));
    }
  };
  const getInputElement = (key: string, parameter: SingleParameter, node?: NodeDTO | GraphWorkflow) => {
    switch (parameter.type) {
      case "boolean":
        return (
          <Checkbox
            checked={parameter.default as boolean}
            // onClick={() => updateParameter(key, !parameter.default, node)}
            inputProps={{ "aria-label": "controlled" }}
          />
        );
      default:
        return (
          <InputField
            placeholder={key}
            value={parameter.default ? parameter.default.toString() : ""}
            onChange={(val: boolean | number | string) => {
              updateParameter(key, val, node);
            }}
          />
        );
    }
  };
  /**
   * Transforms graph and node parameters from InputParameter format to flat key-value pairs.
   * Extracts `parameter.default` values for API submission.
   */
  // const transformDataForSubmit = () => {
  //   const input = allGraphs?.[selectedWorkflowName ?? ""];
  //   const workflowParameters = input?.parameters;
  //   const transformParameters = (params?: InputParameter) => {
  //     let transformedParams = {};
  //     for (const key in params) {
  //       transformedParams = { ...transformedParams, [key]: params[key].default };
  //     }
  //     return transformedParams;
  //   };
  //
  //   const transformedGraph: TransformedGraph = {
  //     parameters: transformParameters(workflowParameters),
  //     nodes: {},
  //   };
  //
  //   //TODO FIX THIS WITH USING KEYS
  //   // for (const nodeKey in input?.nodes) {
  //   //   const node = input?.nodes[nodeKey] as NodeMap; //TODO FIX THIS WITH CASE FOR NESTED GRAPH
  //   //   transformedGraph.nodes[nodeKey] = {
  //   //     parameters: transformParameters(node.parameters),
  //   //   };
  //   // }
  //
  //   for (const nodeKey in input?.nodes) {
  //     const node = input?.nodes[nodeKey];
  //
  //     // Ako je ugnježdeni graf – rekurzija
  //     if ("nodes" in node) {
  //       transformedGraph.nodes[nodeKey] = transformGraph(node);
  //       continue;
  //     }
  //
  //     // Normalan node
  //     transformedGraph.nodes[nodeKey] = {
  //       parameters: transformParameters(node.parameters ?? {}),
  //     };
  //   }
  //
  //   return transformedGraph;
  // };

  const transformParameters = (params?: InputParameter) => {
    let transformedParams = {};
    if (!params) return transformedParams;

    for (const key in params) {
      transformedParams = { ...transformedParams, [key]: params[key].default };
    }
    return transformedParams;
  };

  const transformGraph = (graph: GraphWorkflow): TransformedGraph => {
    const transformed: TransformedGraph = {
      parameters: transformParameters(graph.parameters),
      nodes: {},
    };

    for (const nodeKey in graph.nodes) {
      const node = graph.nodes[nodeKey];
      const isNodeAGraph = "nodes" in node;
      if (isNodeAGraph) {
        const graph = node as GraphWorkflow;
        transformed.nodes[nodeKey] = transformGraph(graph);
        continue;
      }

      transformed.nodes[nodeKey] = {
        parameters: transformParameters(node.parameters),
      };
    }

    return transformed;
  };

  const transformDataForSubmit = () => {
    const input = allGraphs?.[selectedWorkflowName ?? ""];
    if (!input) return;

    return transformGraph(input);
  };
  /**
   * Submits workflow for execution and opens graph-status panel.
   * Sets `lastRunInfo.active` to trigger UI updates via GraphContext.
   */
  const handleSubmit = async () => {
    if (selectedWorkflowName) {
      dispatch(setLastRunActive());
      const response = await GraphLibraryApi.submitWorkflow(selectedWorkflowName, transformDataForSubmit());
      if (response.isOk) {
        setErrorObject(undefined); // This is a bugfix - previously it didn't clear errorObject on success
        dispatch(setActivePage(GRAPH_STATUS_KEY));
      } else {
        setErrorObject(response.error);
      }
    }
  };

  const show = selectedWorkflowName === calibrationGraphKey;
  return (
    <div
      className={classNames(styles.wrapper, show ? styles.calibrationGraphSelected : "")}
      onClick={async () => {
        await dispatch(fetchWorkflowGraph(calibrationGraphKey as string));
        dispatch(setSelectedWorkflowName(calibrationGraphKey));
      }}
    >
      <div className={styles.upperContainer}>
        <div className={styles.leftContainer}>
          <div>{calibrationGraphKey}</div>
          <div className={styles.runButtonWrapper}>
            <BlueButton disabled={!show} onClick={handleSubmit}>
              Run
            </BlueButton>
          </div>
        </div>
        &nbsp; &nbsp; &nbsp; &nbsp;
        {calibrationGraph?.description && (
          <div className={styles.rightContainer}>
            <div>{calibrationGraph?.description}</div>
          </div>
        )}
      </div>
      <div className={styles.bottomContainer}>
        <div className={styles.parametersContainer}>
          <GraphElementErrorWrapper errorObject={errorObject} />
          <Parameters
            key={calibrationGraphKey}
            show={show}
            showTitle={true}
            currentItem={calibrationGraph}
            getInputElement={getInputElement}
          />
          <ParameterList showParameters={show} mapOfItems={calibrationGraph.nodes} />
        </div>
        {show && (
          <div className={styles.graphContainer}>{workflowGraphElements && <CytoscapeGraph elements={workflowGraphElements} />}</div>
        )}
      </div>
    </div>
  );
};
