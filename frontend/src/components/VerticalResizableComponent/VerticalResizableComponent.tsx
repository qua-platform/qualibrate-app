import React, { useCallback } from "react";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./VerticalResizableComponent.module.scss";
import { classNames } from "../../utils/classnames";
import { useSelector } from "react-redux";
import { getJsonData } from "../../stores/SnapshotsStore";
import { formatNames } from "../../utils/formatNames";
import { ParameterStructure } from "../../stores/SnapshotsStore/api/SnapshotsApi";

type Props = {
  tabNames?: string[];
  tabData?: {
    [key: string]: ParameterStructure;
  };
};

const VerticalResizableComponent: React.FC<Props> = ({ tabNames = ["Metadata", "Parameters"], tabData = {} }) => {
  const [expanded, setExpanded] = React.useState(true);
  const [activeTabName, setActiveTabName] = React.useState<string>(tabNames[0]);
  console.log("tabData", tabData);
  const handleOnToggleSidebar = () => {
    setExpanded(!expanded);
  };

  const handleOnSwitchTab = useCallback((tabName: string) => {
    setActiveTabName(tabName);
  }, []);

  const jsonData = useSelector(getJsonData);
  const detailsObject = tabData[activeTabName.toLowerCase()] ?? {};
  console.log("detailsObject", detailsObject);
  console.log("activeTabName", activeTabName);
  console.log("jsonData", jsonData);
  return (
    <div className={classNames(styles.contentSidebar, !expanded && styles.collapsed)} id="contentSidebar">
      <button className={styles.sidebarToggleArrow} id="sidebarToggle" onClick={handleOnToggleSidebar}>
        {expanded ? "◀" : "▶"}
      </button>

      <div className={styles.displayCard}>
        <div className={styles.displayCardTabs}>
          {tabNames.map((tabName) => (
            <div
              key={tabName}
              className={classNames(styles.displayCardTab, activeTabName === tabName && styles.active)}
              onClick={() => handleOnSwitchTab(tabName)}
              id={`tab${tabName}`}
            >
              {tabName}
            </div>
          ))}
        </div>

        <div className={styles.displayCardContent}>
          <div className={styles.displayCardPanelBody}>
            {detailsObject &&
              Object.keys(detailsObject).map((keyValue) => {
                const detailValue = detailsObject[keyValue];

                return (
                  <div key={keyValue} className={classNames(styles.displayCardPanel, styles.active)} id={`panel${activeTabName}`}>
                    <div className={styles.displayParam}>
                      <div className={styles.displayParamLabel}>{formatNames(keyValue)}</div>
                      <div className={styles.displayParamValue}>
                        {detailValue === null || detailValue === undefined
                          ? "—"
                          : typeof detailValue === "object"
                            ? JSON.stringify(detailValue, null, 2)
                            : detailValue}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/*<div className={styles.displayCardContent}>*/}
        {/*  <div className={classNames(styles.displayCardPanel, activeTabName === "metadata" && styles.active)} id="panelMeta">*/}
        {/*    <div className={styles.displayCardPanelBody}>*/}
        {/*      <div className={styles.displayParam}>*/}
        {/*        <div className={styles.displayParamLabel}>Execution ID</div>*/}
        {/*        <div className={styles.displayParamValue}>exec-005</div>*/}
        {/*      </div>*/}

        {/*      <div className={styles.displayParam}>*/}
        {/*        <div className={styles.displayParamLabel}>Duration</div>*/}
        {/*        <div className={styles.displayParamValue}>2m 15s</div>*/}
        {/*      </div>*/}

        {/*      <div className={styles.displayParam}>*/}
        {/*        <div className={styles.displayParamLabel}>Start Time</div>*/}
        {/*        <div className={styles.displayParamValue}>2024-11-16 14:30:00</div>*/}
        {/*      </div>*/}

        {/*      <div className={styles.displayParam}>*/}
        {/*        <div className={styles.displayParamLabel}>End Time</div>*/}
        {/*        <div className={styles.displayParamValue}>—</div>*/}
        {/*      </div>*/}

        {/*      <div className={styles.displayParam}>*/}
        {/*        <div className={styles.displayParamLabel}>Status</div>*/}
        {/*        <div className={styles.displayParamValue}>running</div>*/}
        {/*      </div>*/}

        {/*      <div className={styles.commentSection}>*/}
        {/*        <div className={styles.commentHeader}>*/}
        {/*          <div className={styles.commentLabel}>Comments</div>*/}
        {/*          /!*<button className={styles.addCommentBtn} onClick={handleOpenCommentsModal('exec-005', -1)} title="Add comment">*!/*/}
        {/*          <button className={styles.addCommentBtn} title="Add comment">*/}
        {/*            +*/}
        {/*          </button>*/}
        {/*        </div>*/}

        {/*        <div className={styles.noComment}>No comments yet</div>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </div>*/}

        {/*  <div className={styles.displayCardPanel} id="panelParams">*/}
        {/*    <div className={styles.displayCardPanelBody}>*/}
        {/*      <div className={styles.displayParam}>*/}
        {/*        <div className={styles.displayParamLabel}>Clifford Depths</div>*/}
        {/*        <div className={styles.displayParamValue}>1, 5, 10, 20, 50</div>*/}
        {/*      </div>*/}

        {/*      <div className={styles.displayParam}>*/}
        {/*        <div className={styles.displayParamLabel}>Sequences</div>*/}
        {/*        <div className={styles.displayParamValue}>100</div>*/}
        {/*      </div>*/}

        {/*      <div className={styles.displayParam}>*/}
        {/*        <div className={styles.displayParamLabel}>Qubits</div>*/}
        {/*        <div className={styles.displayParamValue}>Q1</div>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default VerticalResizableComponent;
