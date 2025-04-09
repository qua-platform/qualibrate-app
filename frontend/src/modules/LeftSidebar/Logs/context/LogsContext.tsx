import React, { useContext, useEffect, useState } from "react";
import { NodesApi } from "../../../Nodes/api/NodesAPI";

export interface LogsViewerResponseDTO {
  asctime: string;
  name: string;
  levelname: string;
  message: string;
}

interface ILogsContext {
  logs: LogsViewerResponseDTO[];
}

const LogsContext = React.createContext<ILogsContext>({
  logs: [],
});

export const useLogsContext = (): ILogsContext => useContext<ILogsContext>(LogsContext);

interface LogsContextProviderProps {
  children: React.JSX.Element;
}

export function LogsContextProvider(props: LogsContextProviderProps): React.ReactElement {
  const [logs, setLogs] = useState<LogsViewerResponseDTO[]>([]);

  const checkNewLogs = async () => {
    const maxNumberOfLogs: number = 300;
    const after = logs.length > 0 ? logs[logs.length - 1]?.asctime : null;
    const response = await NodesApi.getLogs(after, null, "300");

    if (response.isOk && response.result) {
      const newLogs = response.result;
      console.log(newLogs[0]);
      if (newLogs.length === maxNumberOfLogs) {
        setLogs(newLogs);
      } else if (newLogs.length > 0) {
        const updatedLogs = [...newLogs, ...logs].slice(0, maxNumberOfLogs);
        setLogs(updatedLogs);
      }
    }
  };

  useEffect(() => {
    const checkInterval = setInterval(async () => checkNewLogs(), 1000);
    return () => clearInterval(checkInterval);
  }, [logs]);

  return (
    <LogsContext.Provider
      value={{
        logs,
      }}
    >
      {props.children}
    </LogsContext.Provider>
  );
}
