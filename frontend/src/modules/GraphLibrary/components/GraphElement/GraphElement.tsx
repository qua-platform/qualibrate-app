import React, { useState } from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./GraphElement.module.scss";
import { classNames } from "../../../../utils/classnames";
import { InputParameter, Parameters, SingleParameter } from "../../../common/Parameters/Parameters";
import { GraphWorkflow } from "../GraphList";
import { useSelectionContext } from "../../../common/context/SelectionContext";
import { Checkbox } from "@mui/material";
import { ParameterList } from "../../../common/Parameters/ParameterList";
import { useGraphContext } from "../../context/GraphContext";
import CytoscapeGraph from "../CytoscapeGraph/CytoscapeGraph";
import { GraphLibraryApi } from "../../api/GraphLibraryApi";
import { NodeDTO } from "../../../Nodes/components/NodeElement/NodeElement";
import { useFlexLayoutContext } from "../../../../routing/flexLayout/FlexLayoutContext";
import { GraphElementErrorWrapper } from "../GraphElementErrorWrapper/GraphElementErrorWrapper";
import BlueButton from "../../../../ui-lib/components/Button/BlueButton";
import InputField from "../../../../common/ui-components/common/Input/InputField";

export interface ICalibrationGraphElementProps {
  calibrationGraphKey?: string;
  calibrationGraph: GraphWorkflow;
}

interface TransformedGraph {
  parameters: { [key: string]: string | number };
  nodes: { [key: string]: { parameters: InputParameter } };
}

export const GraphElement: React.FC<ICalibrationGraphElementProps> = ({ calibrationGraphKey, calibrationGraph }) => {
  const [errorObject, setErrorObject] = useState<unknown>(undefined);
  const { selectedItemName, setSelectedItemName } = useSelectionContext();
  const {
    workflowGraphElements,
    setSelectedWorkflowName,
    allGraphs,
    setAllGraphs,
    selectedWorkflowName,
    lastRunInfo,
    setLastRunInfo,
    fetchWorkflowGraph,
  } = useGraphContext();
  const { openTab } = useFlexLayoutContext();

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

      setAllGraphs(updatedCalibrationGraphs);
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
  const transformDataForSubmit = () => {
    const input = allGraphs?.[selectedWorkflowName ?? ""];
    const workflowParameters = input?.parameters;
    const transformParameters = (params?: InputParameter) => {
      let transformedParams = {};
      for (const key in params) {
        transformedParams = { ...transformedParams, [key]: params[key].default };
      }
      return transformedParams;
    };

    const transformedGraph: TransformedGraph = {
      parameters: transformParameters(workflowParameters),
      nodes: {},
    };

    for (const nodeKey in input?.nodes) {
      const node = input?.nodes[nodeKey];
      transformedGraph.nodes[nodeKey] = {
        parameters: transformParameters(node.parameters),
      };
    }

    return transformedGraph;
  };

  const handleSubmit = async () => {
    if (selectedWorkflowName) {
      setLastRunInfo({
        ...lastRunInfo,
        active: true,
      });
      const response = await GraphLibraryApi.submitWorkflow(selectedWorkflowName, transformDataForSubmit());
      if (response.isOk) {
        openTab("graph-status");
      } else {
        setErrorObject(response.error);
      }
    }
  };

  const show = selectedItemName === calibrationGraphKey;
  return (
    <div
      className={classNames(styles.wrapper, show ? styles.calibrationGraphSelected : "")}
      onClick={async () => {
        await fetchWorkflowGraph(calibrationGraphKey as string);
        setSelectedItemName(calibrationGraphKey);
        setSelectedWorkflowName(calibrationGraphKey);
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
