import React, { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from "react";
import WebSocketService from "../services/WebSocketService";
import { WS_EXECUTION_HISTORY, WS_GET_STATUS } from "../services/webSocketRoutes";
import { ErrorObject } from "../modules/common/Error/ErrorStatusWrapper";
import { Measurement } from "../modules/GraphLibrary/components/GraphStatus/context/GraphStatusContext";

export interface RunResults {
  parameters: Record<string, unknown>;
  outcomes: Record<string, unknown>;
  error: ErrorObject | null;
  initial_targets: unknown[];
  successful_targets: unknown[];
}

export interface NodeExecution {
  current_action: string | null;
  description: string | null;
  id: number;
  name: string;
  parameters: Record<string, unknown>; // prazni objekti – fleksibilna struktura
  percentage_complete: number;
  run_duration: number;
  run_end: string; // ISO timestamp string
  run_start: string; // ISO timestamp string
  status: "pending" | "running" | "finished" | "failed" | string; // koristi preciznije ako znaš sve vrednosti
  time_remaining: number;
  run_results: RunResults;
}

type GraphItem = {
  is_running: boolean;
  name: string;
  finished_nodes: number;
  total_nodes: number;
  run_duration: number;
  error: ErrorObject;
};

export type RunStatusType = {
  graph: GraphItem | null;
  is_running: boolean;
  node: NodeExecution | null;
  runnable_type: string | null;
};

export type HistoryType = {
  items: Measurement[];
};

type WebSocketData = {
  runStatus: RunStatusType | null;
  history: HistoryType | null;
  sendRunStatus: (data: RunStatusType) => void;
  sendHistory: (data: HistoryType) => void;
  subscribeToRunStatus: (cb: (data: RunStatusType) => void) => void;
  unsubscribeFromRunStatus: (cb: (data: RunStatusType) => void) => void;
  subscribeToHistory: (cb: (data: HistoryType) => void) => void;
  unsubscribeFromHistory: (cb: (data: HistoryType) => void) => void;
};

const WebSocketContext = createContext<WebSocketData>({
  runStatus: null,
  history: null,
  sendRunStatus: () => {},
  sendHistory: () => {},
  subscribeToRunStatus: () => {},
  unsubscribeFromRunStatus: () => {},
  subscribeToHistory: () => {},
  unsubscribeFromHistory: () => {},
});

export const useWebSocketData = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const protocol = process.env.WS_PROTOCOL || "ws";
  const host = process.env.WS_BASE_URL || "localhost:8001/";
  const runStatusWS = useRef<WebSocketService<RunStatusType> | null>(null);
  const historyWS = useRef<WebSocketService<HistoryType> | null>(null);
  const [runStatus, setRunStatus] = useState<RunStatusType | null>(null);
  const [history, setHistory] = useState<HistoryType | null>(null);

  useEffect(() => {
    const runStatusUrl = `${protocol}://${host}${WS_GET_STATUS}`;
    const historyUrl = `${protocol}://${host}${WS_EXECUTION_HISTORY}`;

    runStatusWS.current = new WebSocketService<RunStatusType>(runStatusUrl, setRunStatus);
    historyWS.current = new WebSocketService<HistoryType>(historyUrl, setHistory);

    if (runStatusWS.current) {
      runStatusWS.current.connect();
    }
    if (historyWS.current) {
      historyWS.current.connect();
    }

    return () => {
      if (runStatusWS.current) {
        runStatusWS.current.disconnect();
      }
      if (historyWS.current) {
        historyWS.current.disconnect();
      }
    };
  }, []);

  const sendRunStatus = (data: RunStatusType) => runStatusWS.current?.send(data);
  const sendHistory = (data: HistoryType) => historyWS.current?.send(data);

  const subscribeToRunStatus = (cb: (data: RunStatusType) => void) => runStatusWS.current?.subscribe(cb);
  const unsubscribeFromRunStatus = (cb: (data: RunStatusType) => void) => runStatusWS.current?.unsubscribe(cb);

  const subscribeToHistory = (cb: (data: HistoryType) => void) => historyWS.current?.subscribe(cb);
  const unsubscribeFromHistory = (cb: (data: HistoryType) => void) => historyWS.current?.unsubscribe(cb);

  return (
    <WebSocketContext.Provider
      value={{
        runStatus,
        history,
        sendRunStatus,
        sendHistory,
        subscribeToRunStatus,
        unsubscribeFromRunStatus,
        subscribeToHistory,
        unsubscribeFromHistory,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
