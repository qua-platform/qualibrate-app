import { formatDateTime } from "../../../GraphLibrary/components/GraphStatus/components/MeasurementElement/MeasurementElement";
import { LogsViewerResponseDTO } from "../../context/RightSidePanelContext";

export type LogEntry = LogsViewerResponseDTO;

export const getLogLevelClass = (levelname: string): string => {
  const level = levelname.toLowerCase();
  if (level === "debug") return "debug";
  if (level === "info") return "info";
  if (level === "warning") return "warning";
  if (level === "error") return "error";
  if (level === "critical") return "critical";
  return "info";
};

export const formatLogForClipboard = (log: LogEntry): string => {
  const timestamp = formatDateTime(log.asctime);
  const baseLog = `[${timestamp}] ${log.name} - ${log.levelname}\n${log.message || ""}`;
  
  if (log.exc_info) {
    return `${baseLog}\n\nException:\n${log.exc_info}`;
  }
  
  return baseLog;
};

export const splitMessageIntoLines = (message: string | undefined): string[] => {
  if (!message) return [];
  return message.split("\\n");
};

export const splitExceptionIntoLines = (exc_info: string | undefined): string[] => {
  if (!exc_info) return [];
  return exc_info.split("\\n");
};

export { formatDateTime };
