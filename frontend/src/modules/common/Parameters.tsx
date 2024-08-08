import React, { useEffect } from "react";
import { classNames } from "../../utils/classnames";
import styles from "./Parameters.module.scss";
import { NodeDTO } from "../Nodes/components/NodeElement/NodeElement";
import { ArrowIcon } from "../../ui-lib/Icons/ArrowIcon";
import { CalibrationGraphWorkflow } from "../CalibrationGraph/components/CalibrationGraphList";
import { useCalibrationGraphContext } from "../CalibrationGraph/context/CalibrationGraphContext";

interface IProps {
  parametersExpanded?: boolean;
  show: boolean;
  showTitle: boolean;
  title?: string;
  currentItem?: NodeDTO | CalibrationGraphWorkflow;
  getInputElement: (key: string, parameter: SingleParameter, node?: NodeDTO | CalibrationGraphWorkflow) => React.JSX.Element;
}

export interface SingleParameter {
  default?: string | boolean | number;
  title: string;
  type: string;
}

export interface InputParameter {
  [key: string]: SingleParameter;
}

export const Parameters: React.FC<IProps> = ({
  parametersExpanded = false,
  show = false,
  showTitle = true,
  title,
  currentItem,
  getInputElement,
}) => {
  const { selectedNodeNameInWorkflow } = useCalibrationGraphContext();
  const [expanded, setExpanded] = React.useState<boolean>(selectedNodeNameInWorkflow === title ?? parametersExpanded);

  useEffect(() => {
    if (selectedNodeNameInWorkflow === title) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  }, [selectedNodeNameInWorkflow]);

  return (
    <div className={classNames(styles.parametersWrapper, !show && styles.nodeNotSelected)}>
      {showTitle && Object.entries(currentItem?.parameters ?? {}).length > 0 && (
        <div className={styles.parameterTitle}>
          <div
            className={styles.arrowIconWrapper}
            onClick={() => {
              setExpanded(!expanded);
            }}
          >
            <ArrowIcon options={{ rotationDegree: expanded ? 0 : -90 }} />
          </div>
          {title ?? "Parameters"}
        </div>
      )}
      {expanded &&
        Object.entries(currentItem?.parameters ?? {}).map(([key, parameter]) => (
          <div key={key} className={styles.parameterValues}>
            <div className={styles.parameterLabel}>{parameter.title}:</div>
            <div className={styles.parameterValue}>{getInputElement(key, parameter, currentItem)}</div>
          </div>
        ))}
    </div>
  );
};
