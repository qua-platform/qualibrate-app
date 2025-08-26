import { useCallback, useState } from "react";
import { LogEntry, formatLogForClipboard } from "../utils/logUtils";

interface UseLogsCopyReturn {
  copiedIndex: number | null;
  copyLogToClipboard: (log: LogEntry, index: number) => Promise<void>;
}

export const useLogsCopy = (): UseLogsCopyReturn => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyLogToClipboard = useCallback(async (log: LogEntry, index: number) => {
    try {
      const logText = formatLogForClipboard(log);
      
      await navigator.clipboard.writeText(logText);
      setCopiedIndex(index);
      
      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy log to clipboard:", err);
    }
  }, []);

  return {
    copiedIndex,
    copyLogToClipboard
  };
};
