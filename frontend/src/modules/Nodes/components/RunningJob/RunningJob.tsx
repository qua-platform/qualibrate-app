import React, { useState } from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./RunningJob.module.scss";
import { StateUpdates } from "../StateUpdates/StateUpdates";
import { RunningJobInfoSection } from "./RunningJobInfoSection";
import { RunningJobParameters } from "./RunningJobParameters";
import { RunningJobTitleRow } from "./RunningJobTitle";
import { CollapsedComponentIcon } from "../../../../ui-lib/Icons/CollapsedComponentIcon";
import { classNames } from "../../../../utils/classnames";

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
    const [show, setShow] = useState(false);
    return (
      <>
        <div className={classNames(styles.parametersStateCollapsedComponent, cssClassName)}>
          <div className={styles.collapsedTitleWrapper}>{title}</div>
          <div className={styles.collapsedIconWrapper} onMouseOverCapture={() => setShow(true)} onMouseLeave={() => setShow(false)}>
            <CollapsedComponentIcon />
          </div>
          {show && el}
        </div>
      </>
    );
  };

  const ParametersAndStateUpdatesCollapsedComponentWrapper: React.FC = () => {
    const parameterElement = <div>Parameters</div>;
    const stateUpdatesElement = <div>State updates</div>;
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
