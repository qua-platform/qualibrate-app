import React, { useState } from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./RunningJob.module.scss";
import { StateUpdates } from "../StateUpdates/StateUpdates";
import { RunningJobInfoSection } from "./RunningJobInfoSection";
import { RunningJobParameters } from "./RunningJobParameters";
import { RunningJobTitleRow } from "./RunningJobTitle";
import { CollapsedComponentIcon } from "../../../../ui-lib/Icons/CollapsedComponentIcon";
import { classNames } from "../../../../utils/classnames";
import { StateUpdatesTooltip } from "../StateUpdates/StateUpdatesTooltip";

interface IProps {
  expanded: boolean;
}

export const RunningJob: React.FC<IProps> = ({ expanded }) => {
  const ParametersAndStateExpanded: React.FC = () => {
    return (
      <>
        <div className={styles.parameterColumnWrapper}>
          <RunningJobParameters />
        </div>
        <div className={styles.statesColumnWrapper} data-testid="states-column-wrapper">
          <StateUpdates />
        </div>
      </>
    );
  };
  const ParametersStateCollapsedComponent: React.FC<{
    cssClassName?: string;
    title: string;
    el: React.JSX.Element;
  }> = ({ cssClassName, title, el }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const handleOnMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      setShowTooltip(true);
    };
    const handleOnMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      setShowTooltip(false);
    };
    return (
      <>
        <div className={classNames(styles.parametersStateCollapsedComponent, cssClassName)}>
          <div className={styles.collapsedTitleWrapper}>{title}</div>
          <div onMouseOver={handleOnMouseOver} onMouseLeave={handleOnMouseLeave}>
            <div className={styles.collapsedIconWrapper}>
              <CollapsedComponentIcon />
            </div>
          </div>
          <div className={classNames(styles.tooltipElement, !showTooltip ? styles.show : styles.hide)}>{el}</div>
        </div>
      </>
    );
  };

  const ParametersAndStateUpdatesCollapsedComponentWrapper: React.FC = () => {
    const parameterElement = (
      <div className={styles.parameterColumnWrapper}>
        <RunningJobParameters />
      </div>
    );
    const stateUpdatesElement = (
      <div className={styles.parameterColumnWrapper}>
        <StateUpdatesTooltip />
      </div>
    );
    return (
      <>
        <div className={styles.parameterColumnWrapper}>
          <ParametersStateCollapsedComponent title={"Parameters"} el={parameterElement} />
        </div>
        <div className={styles.statesColumnWrapper}>
          <ParametersStateCollapsedComponent title={"State updates"} el={stateUpdatesElement} />
        </div>
      </>
    );
  };
  return (
    <div className={styles.wrapper} data-testid="running-job-wrapper">
      <RunningJobTitleRow />
      <RunningJobInfoSection />
      <div className={styles.parameterStatesWrapper}>
        {!expanded && <ParametersAndStateExpanded />}
        {expanded && <ParametersAndStateUpdatesCollapsedComponentWrapper />}
      </div>
    </div>
  );
};
