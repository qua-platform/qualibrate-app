import React from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./RunningJob.module.scss";
import { StateUpdates } from "../StateUpdates/StateUpdates";
import { RunningJobInfoSection } from "./RunningJobInfoSection";
import { RunningJobParameters } from "./RunningJobParameters";
import { RunningJobTitleRow } from "./RunningJobTitle";

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
  const ParametersAndStateCollapsed: React.FC = () => {
    return (
      <>
        <div className={styles.parameterColumnWrapper}>aaaaaaaaaaaaaaaaaaa</div>
        <div className={styles.statesColumnWrapper} data-testid="states-column-wrapper">
          bbbbbbbbbbbbbbbbbbbbb
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
        {expanded && <ParametersAndStateCollapsed />}
      </div>
    </div>
  );
};
