import React, { useContext, useEffect, useState } from "react";
import { NodeDTO, NodeMap } from "../components/NodeElement/NodeElement";
import noop from "../../../common/helpers";
import { NodesApi } from "../api/NodesAPI";
import { SnapshotsApi } from "../../Snapshots/api/SnapshotsApi";
import { ErrorObject } from "../../common/Error/ErrorStatusWrapper";

export interface StateUpdateObject {
  key?: string | number;
  attr?: string;
  old?: string | number | object | number[];
  val?: string | number | object | number[];
  new?: string | number | object | number[];
}

export interface StateUpdate {
  [key: string]: StateUpdateObject;
}

export interface RunningNodeInfo {
  timestampOfRun?: string;
  runDuration?: string;
  status?: string;
  lastRunNodeName?: string;
  state_updates?: StateUpdate;
  error?: ErrorObject;
  idx?: string;
}

interface INodesContext {
  responseError?: ErrorObject;
  runningNode?: NodeDTO;
  runningNodeInfo?: RunningNodeInfo;
  setRunningNode: (selectedNode: NodeDTO) => void;
  setRunningNodeInfo: (runningNodeInfo: RunningNodeInfo) => void;
  allNodes?: NodeMap;
  setAllNodes: (nodes: NodeMap) => void;
  isNodeRunning: boolean;
  setIsNodeRunning: (value: boolean) => void;
  results?: unknown | object;
  setResults: (value: unknown | object | undefined) => void;
  fetchAllNodes: () => void;
}

const NodesContext = React.createContext<INodesContext>({
  runningNode: undefined,
  runningNodeInfo: undefined,
  setRunningNode: noop,
  setRunningNodeInfo: noop,
  allNodes: undefined,
  setAllNodes: noop,
  isNodeRunning: false,
  setIsNodeRunning: noop,
  results: undefined,
  setResults: noop,
  fetchAllNodes: noop,
});

export const useNodesContext = (): INodesContext => useContext<INodesContext>(NodesContext);

interface NodesContextProviderProps {
  children: React.JSX.Element;
}

export interface NodeStatusErrorWithDetails {
  detail: { msg: string; type: string }[];
}

export interface StatusResponseType {
  idx: number;
  status: string;
  error?: ErrorObject;
  name: string;
  state_updates?: StateUpdate;
  run_result?: {
    parameters?: {
      nodes: { [key: string]: string };
    };
  };
}

export function NodesContextProvider(props: NodesContextProviderProps): React.ReactElement {
  const [allNodes, setAllNodes] = useState<NodeMap | undefined>(undefined);
  const [runningNode, setRunningNode] = useState<NodeDTO | undefined>(undefined);
  const [runningNodeInfo, setRunningNodeInfo] = useState<RunningNodeInfo | undefined>(undefined);
  const [isNodeRunning, setIsNodeRunning] = useState<boolean>(false);
  const [results, setResults] = useState<unknown | object | undefined>(undefined);

  const fetchAllNodes = async () => {
    const response = await NodesApi.fetchAllNodes();
    if (response.isOk) {
      setAllNodes(response.result! as NodeMap);
    } else if (response.error) {
      console.log(response.error);
    }
  };
  useEffect(() => {
    fetchAllNodes();
  }, []);

  function parseDateString(dateString: string): Date {
    const [datePart, timePart] = dateString.split(" ");
    const [year, month, day] = datePart.split("/").map(Number);
    const [hours, minutes, seconds] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }

  const fetchNodeResults = async () => {
    const lastRunResponse = await NodesApi.fetchLastRunInfo();
    if (lastRunResponse && lastRunResponse.isOk) {
      const lastRunResponseResult = lastRunResponse.result as StatusResponseType;
      if (lastRunResponseResult && lastRunResponseResult.status !== "error") {
        const idx = lastRunResponseResult.idx.toString();
        if (lastRunResponseResult.idx) {
          const snapshotResponse = await SnapshotsApi.fetchSnapshotResult(idx);
          if (snapshotResponse && snapshotResponse.isOk) {
            if (runningNodeInfo && runningNodeInfo.timestampOfRun) {
              const startDateAndTime: Date = parseDateString(runningNodeInfo?.timestampOfRun);
              const now: Date = new Date();
              const diffInMs = now.getTime() - startDateAndTime.getTime();
              const diffInSeconds = Math.floor(diffInMs / 1000);
              setRunningNodeInfo({
                ...runningNodeInfo,
                runDuration: diffInSeconds.toFixed(2),
                status: lastRunResponseResult.status,
                idx: lastRunResponseResult.idx.toString(),
                state_updates: lastRunResponseResult.state_updates,
              });
            } else if (!runningNodeInfo?.timestampOfRun) {
              setRunningNodeInfo({
                ...runningNodeInfo,
                lastRunNodeName: lastRunResponseResult.name,
                status: lastRunResponseResult.status,
                idx: lastRunResponseResult.idx.toString(),
                state_updates: lastRunResponseResult.state_updates,
              });
            }
            setResults(snapshotResponse.result);
          } else {
            console.log("snapshotResponse error", snapshotResponse.error);
          }
        } else {
          console.log("last run idx is falsy = ", lastRunResponseResult.idx);
        }
      } else {
        const error = lastRunResponseResult && lastRunResponseResult.error ? lastRunResponseResult.error : undefined;
        if (!lastRunResponseResult) {
          setRunningNodeInfo({
            ...runningNodeInfo,
            status: "idle",
            error,
          });
        } else if (lastRunResponseResult && lastRunResponseResult.status === "error") {
          setRunningNodeInfo({
            ...runningNodeInfo,
            status: "error",
            error,
          });
        }
        console.log("last run status was error");
      }
    } else {
      console.log("lastRunResponse was ", lastRunResponse);
    }
  };

  useEffect(() => {
    if (!isNodeRunning) {
      fetchNodeResults();
      if (runningNodeInfo?.status === "running") {
        setRunningNodeInfo({
          ...runningNodeInfo,
          status: "finished",
        });
      }
    }
  }, [isNodeRunning]);

  const checkIfNodeIsStillRunning = async () => {
    const response = await NodesApi.checkIsNodeRunning();
    if (response.isOk) {
      // console.log("checkIfNodeIsStillRunning", response.result);
      setIsNodeRunning(response.result as boolean);
    }
  };
  useEffect(() => {
    const checkInterval = setInterval(async () => checkIfNodeIsStillRunning(), 500);
    return () => clearInterval(checkInterval);
  }, []);

  return (
    <NodesContext.Provider
      value={{
        runningNode,
        setRunningNode,
        runningNodeInfo,
        setRunningNodeInfo,
        allNodes,
        setAllNodes,
        isNodeRunning,
        setIsNodeRunning,
        results,
        setResults,
        fetchAllNodes,
      }}
    >
      {props.children}
    </NodesContext.Provider>
  );
}
