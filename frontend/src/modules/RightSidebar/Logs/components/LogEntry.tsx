import React from "react";
import { LogEntry as LogEntryType, getLogLevelClass, splitMessageIntoLines, splitExceptionIntoLines } from "../utils/logUtils";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "../styles/LogsPanel.module.scss";
import { formatDateTime } from "../../../GraphLibrary/components/GraphStatus/components/MeasurementElement/MeasurementElement";

interface LogEntryProps {
  log: LogEntryType;
  index: number;
  copiedIndex: number | null;
  onCopy: (log: LogEntryType, index: number) => Promise<void>;
}

export const LogEntry: React.FC<LogEntryProps> = React.memo(({ 
  log, 
  index, 
  copiedIndex, 
  onCopy 
}) => {
  const handleCopy = React.useCallback(() => {
    onCopy(log, index);
  }, [log, index, onCopy]);

  const renderLogMessage = React.useCallback(() => {
    const lines = splitMessageIntoLines(log.message);
    if (lines.length === 0) return null;
    
    return lines.map((item, idx) => (
      <span key={idx}>
        {item}
        {idx < lines.length - 1 && <br />}
      </span>
    ));
  }, [log.message]);

  const renderException = React.useCallback(() => {
    const lines = splitExceptionIntoLines(log.exc_info);
    if (lines.length === 0) return null;
    
    return (
      <div className={styles.logException}>
        {lines.map((item, idx) => (
          <span key={idx}>
            {item}
            {idx < lines.length - 1 && <br />}
          </span>
        ))}
      </div>
    );
  }, [log.exc_info]);

  return (
    <div className={styles.logEntry}>
      <button
        className={`${styles.copyButton} ${copiedIndex === index ? styles.copied : ""}`}
        onClick={handleCopy}
        title={copiedIndex === index ? "Copied!" : "Copy log to clipboard"}
      >
        {copiedIndex === index ? "✓ Copied" : "Copy"}
      </button>
      <div className={styles.logsTimestamp}>
        <span>{formatDateTime(log.asctime)}</span>
        <span className={styles.logName}>{log.name}</span>
        <span className={`${styles.logLevel} ${styles[getLogLevelClass(log.levelname)]}`}>
          {log.levelname}
        </span>
      </div>
      <div className={styles.logsMessage}>
        {renderLogMessage()}
      </div>
      {renderException()}
    </div>
  );
});

LogEntry.displayName = "LogEntry";
