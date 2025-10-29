import React, { useState } from "react";
import { JSONEditor } from "../../../Data/components/JSONEditor";
import styles from "./Results.module.scss";
import { ModuleKey } from "../../../../routing/ModulesRegistry";
import ErrorIcon from "../../../../ui-lib/Icons/ErrorIcon";
import { ErrorObject } from "../../../common/Error/ErrorStatusWrapper";
import { Collapse } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const ResultsError: React.FC<{ style?: React.CSSProperties; errorObject: ErrorObject }> = ({ style, errorObject }) => {
  const [isTracebackExpanded, setIsTracebackExpanded] = useState(false);

  const toggleTraceback = () => {
    setIsTracebackExpanded(!isTracebackExpanded);
  };

  const hasTraceback = errorObject.traceback && errorObject.traceback.length > 0;

  return (
    <div className={styles.errorWrapper} style={style} data-testid="results-wrapper">
      <div className={styles.errorHeader}>
        <div className={styles.errorIcon}>
          <ErrorIcon height={20} width={20} />
        </div>
        <div className={styles.errorHeaderTitle}>Error</div>
      </div>
      <div className={styles.errorContent}>
        <div>
          <div className={styles.errorLabel}>{errorObject.error_class} occurred:</div>
          <div className={styles.errorText}>{errorObject.message}</div>
        </div>
        {hasTraceback && (
          <div>
            <div
              className={styles.tracebackHeader}
              onClick={toggleTraceback}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleTraceback();
                }
              }}
              aria-expanded={isTracebackExpanded}
              aria-label="Toggle error traceback"
              data-testid="traceback-toggle"
            >
              <div className={styles.errorLabel}>Error traceback:</div>
              <div className={styles.tracebackIcon}>
                {isTracebackExpanded ? (
                  <ExpandMoreIcon fontSize="small" data-testid="expand-more-icon" />
                ) : (
                  <ChevronRightIcon fontSize="small" data-testid="chevron-right-icon" />
                )}
              </div>
            </div>
            <Collapse in={isTracebackExpanded} timeout="auto">
              <div className={styles.errorText} data-testid="traceback-content">
                {(errorObject.traceback ?? []).map((row, index) => (
                  <div key={`${row}-${index}`}>{row}</div>
                ))}
              </div>
            </Collapse>
          </div>
        )}
      </div>
    </div>
  );
};

export const Results: React.FC<{
  title?: string;
  jsonObject: object;
  showSearch?: boolean;
  toggleSwitch?: boolean;
  pageName?: ModuleKey;
  errorObject: ErrorObject | null | undefined;
  style?: React.CSSProperties;
}> = ({ title, jsonObject, showSearch = true, toggleSwitch = false, pageName, style, errorObject }) => {
  if (errorObject) {
    return <ResultsError style={style} errorObject={errorObject} />;
  }

  return (
    <div className={styles.wrapper} style={style} data-testid="results-wrapper">
      <JSONEditor
        title={title ?? "Results"}
        jsonDataProp={jsonObject}
        height={"100%"}
        showSearch={showSearch}
        toggleSwitch={toggleSwitch}
        pageName={pageName}
      />
    </div>
  );
};
