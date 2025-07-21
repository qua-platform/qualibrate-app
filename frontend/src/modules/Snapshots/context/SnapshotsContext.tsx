import React, { Dispatch, PropsWithChildren, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { SnapshotDTO } from "../SnapshotDTO";
import { SnapshotResult, SnapshotsApi } from "../api/SnapshotsApi";
import { Res } from "../../../common/interfaces/Api";

interface ISnapshotsContext {
  // trackLatestSidePanel: boolean;
  graphIsRunning: boolean;
  setGraphIsRunning: Dispatch<SetStateAction<boolean>>; 
  trackLatestSidePanel: boolean;
  setTrackLatestSidePanel: Dispatch<SetStateAction<boolean>>;
  trackPreviousSnapshot: boolean;
  setTrackPreviousSnapshot: Dispatch<SetStateAction<boolean>>;
  totalPages: number;
  pageNumber: number;
  setPageNumber: (pageNumber: number) => void;
  allSnapshots: SnapshotDTO[];
  setAllSnapshots: Dispatch<SetStateAction<SnapshotDTO[]>>;

  selectedSnapshotId: number | undefined;
  setSelectedSnapshotId: Dispatch<SetStateAction<number | undefined>>;

  latestSnapshotId: number | undefined;
  setLatestSnapshotId: Dispatch<SetStateAction<number | undefined>>;

  clickedForSnapshotSelection: boolean;
  setClickedForSnapshotSelection: Dispatch<SetStateAction<boolean>>;

  fetchOneSnapshot: (id: number, id2?: number, updateResult?: boolean, fetchUpdate?: boolean) => void;
  jsonData: object | undefined;
  setJsonData: Dispatch<SetStateAction<object | undefined>>;
  jsonDataSidePanel: object | undefined;
  setJsonDataSidePanel: Dispatch<SetStateAction<object | undefined>>;
  diffData: object | undefined;
  setDiffData: Dispatch<SetStateAction<object | undefined>>;
  result: object | undefined;
  setResult: Dispatch<SetStateAction<object | undefined>>;
  firstId: string;
  setFirstId: (id: string) => void;
  secondId: string;
  setSecondId: (id: string) => void;
  currentWorkflowExecutionId: string | undefined;
  setCurrentWorkflowExecutionId: Dispatch<SetStateAction<string | undefined>>;
  freezeLatestSnapshot: boolean;
  setFreezeLatestSnapshot: Dispatch<SetStateAction<boolean>>;
  fetchingSnapshotId: number | undefined;
  setFetchingSnapshotId: Dispatch<SetStateAction<number | undefined>>;
}

export const SnapshotsContext = React.createContext<ISnapshotsContext>({
  graphIsRunning: false,
  setGraphIsRunning: () => {},
  currentWorkflowExecutionId: undefined,
  setCurrentWorkflowExecutionId: () => {},
  trackLatestSidePanel: true,
  setTrackLatestSidePanel: () => {},
  trackPreviousSnapshot: true,
  setTrackPreviousSnapshot: () => {},
  totalPages: 0,
  pageNumber: 0,
  setPageNumber: () => {},
  allSnapshots: [],
  setAllSnapshots: () => {},

  selectedSnapshotId: undefined,
  setSelectedSnapshotId: () => {},

  latestSnapshotId: undefined,
  setLatestSnapshotId: () => {},

  clickedForSnapshotSelection: false,
  setClickedForSnapshotSelection: () => {},

  fetchOneSnapshot: () => {},

  jsonData: {},
  setJsonData: () => {},
  jsonDataSidePanel: {},
  setJsonDataSidePanel: () => {},
  diffData: {},
  setDiffData: () => {},
  result: {},
  setResult: () => {},
  firstId: "0",
  setFirstId: () => {},
  secondId: "0",
  setSecondId: () => {},
  freezeLatestSnapshot: false,
  setFreezeLatestSnapshot: () => {},
  fetchingSnapshotId: undefined,
  setFetchingSnapshotId: () => {},
});

export const useSnapshotsContext = (): ISnapshotsContext => useContext<ISnapshotsContext>(SnapshotsContext);

export function SnapshotsContextProvider(props: PropsWithChildren<ReactNode>): React.ReactElement {
  const [trackLatestSidePanel, setTrackLatestSidePanel] = useState(true);
  const [trackPreviousSnapshot, setTrackPreviousSnapshot] = useState(true);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [allSnapshots, setAllSnapshots] = useState<SnapshotDTO[]>([]);

  const [selectedSnapshotId, setSelectedSnapshotId] = useState<number | undefined>(undefined);
  const [clickedForSnapshotSelection, setClickedForSnapshotSelection] = useState<boolean>(false);
  const [latestSnapshotId, setLatestSnapshotId] = useState<number | undefined>(undefined);

  const [reset, setReset] = useState<boolean>(false);

  const [jsonDataSidePanel, setJsonDataSidePanel] = useState<object | undefined>(undefined);
  const [jsonData, setJsonData] = useState<object | undefined>(undefined);
  const [diffData, setDiffData] = useState<object | undefined>(undefined);
  const [result, setResult] = useState<object | undefined>(undefined);

  const [firstId, setFirstId] = useState<string>("0");
  const [secondId, setSecondId] = useState<string>("0");
  const [graphIsRunning, setGraphIsRunning] = useState(false);
  const [currentWorkflowExecutionId, setCurrentWorkflowExecutionId] = useState<string | undefined>(undefined);
  const [freezeLatestSnapshot, setFreezeLatestSnapshot] = useState<boolean>(false);
  const [fetchingSnapshotId, setFetchingSnapshotId] = useState<number | undefined>(undefined);

  // -----------------------------------------------------------
  // FIRST FETCH ALL SNAPSHOTS ON THE BEGINNING
  const fetchGitgraphSnapshots = (firstTime: boolean, page: number) => {
    if (graphIsRunning) {
      // console.log("SnapshotsContext: Graph is running, skipping snapshot fetch to avoid overwriting active node result");
      return;
    }
    if (freezeLatestSnapshot) {
      // console.log("SnapshotsContext: Freeze active, skipping snapshot reset.");
      return;
    }
    SnapshotsApi.fetchAllSnapshots(page).then((promise: Res<SnapshotResult>) => {
      if (promise.isOk) {
        setTotalPages(promise.result?.total_pages ?? 1);
        setPageNumber(promise.result?.page ?? 1);
        setAllSnapshots(promise?.result?.items ?? []);
        let lastElId = 0;

        if (promise?.result?.items) {
          lastElId = promise?.result.items.length > 0 ? promise?.result.items[0]?.id : 0;
          setLatestSnapshotId(lastElId);
          if (trackLatestSidePanel) {
            if (trackPreviousSnapshot) {
              fetchOneSnapshot(lastElId, lastElId - 1, false, true);
            } else {
              fetchOneSnapshot(lastElId, Number(secondId), false, true);
            }
          }
        }
        if (firstTime) {
          if (promise?.result?.items) {
            // const lastElId = promise?.result.items.length > 0 ? promise?.result.items[0].id : 0;
            setSelectedSnapshotId(lastElId);
            // const lastIndex = promise?.result.items.length - 1;
            fetchOneSnapshot(lastElId, lastElId - 1, false, true);
          }
        } else {
          if (selectedSnapshotId) {
            fetchOneSnapshot(selectedSnapshotId);
            setReset(false);
          }
        }
      }
    });
  };

  useEffect(() => {
    setAllSnapshots([]);
    fetchGitgraphSnapshots(true, pageNumber);
  }, [pageNumber]);
  // -----------------------------------------------------------
  // -----------------------------------------------------------

  // -----------------------------------------------------------
  // PERIODICAL FETCH ALL SNAPSHOTS
  const intervalFetch = (page: number) => {
    if (graphIsRunning) {
      // console.log("SnapshotsContext: Graph is running, skipping interval fetch");
      return;
    }
    SnapshotsApi.fetchAllSnapshots(page).then((promise: Res<SnapshotResult>) => {
      setTotalPages(promise.result?.total_pages as number);
      setPageNumber(promise.result?.page as number);
      const newMaxId = promise.result?.items[0]?.id;
      const oldMaxId = allSnapshots[0]?.id;
      // console.log(`Max snapshot ID - previous=${oldMaxId}, latest=${newMaxId}`);
      if (newMaxId !== oldMaxId! && allSnapshots.length !== 0) {
        setReset(true);
      } else {
        setReset(false);
      }
      return promise;
    });
  };

  // TODO Add lastSelectedId! in state

  useEffect(() => {
    const checkInterval = setInterval(async () => intervalFetch(pageNumber), 1000);
    return () => clearInterval(checkInterval);
  }, [allSnapshots, pageNumber]);
  // -----------------------------------------------------------

  // -----------------------------------------------------------
  // PERIODICAL FETCH ALL SNAPSHOTS
  useEffect(() => {
    if (reset) {
      // setAllSnapshots([]);
      const updateFn = setTimeout(() => fetchGitgraphSnapshots(false, pageNumber), 2);
      return () => clearTimeout(updateFn);
    }
  }, [reset, pageNumber]);
  // -----------------------------------------------------------

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    if (graphIsRunning) {
      if (allSnapshots.length > 0 && latestSnapshotId === allSnapshots[0].id) {
        timeoutId = setTimeout(() => {
          console.log("Graph execution likely completed. Stopping tracking after debounce.");
          setGraphIsRunning(false);
          setFreezeLatestSnapshot(true); // Prevent snapshot context reset
        }, 3000);
      }
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [allSnapshots, graphIsRunning, latestSnapshotId]);

  const fetchOneSnapshot = (snapshotId: number, snapshotId2?: number, updateResult = true, fetchUpdate = false) => {
    // Prevent duplicate fetches
    if (fetchingSnapshotId === snapshotId) {
      // console.log(`Already fetching snapshot ${snapshotId}, skipping duplicate fetch.`);
      return;
    }
    if (selectedSnapshotId === snapshotId && jsonData) {
      // console.log(`Snapshot ${snapshotId} is already loaded, skipping fetch.`);
      return;
    }
    setFetchingSnapshotId(snapshotId);
    // console.log("fetchOneSnapshot", snapshotId, snapshotId2, updateResult);
    // const fetchOneSnapshot = (snapshots: SnapshotDTO[], index: number) => {
    // const id1 = snapshots[index].id.toString();
    // const index2 = index - 1 >= 0 ? index - 1 : 0;
    // const index2 = selectedSnapshotId ? (selectedSnapshotId - 1 >= 0 ? selectedSnapshotId - 1 : 0) : 0;
    const id1 = snapshotId.toString();
    let id2 = snapshotId2?.toString();
    if (!id2 || id1 === id2) {
      id2 = undefined; // Prevent self-compare or invalid compare
    }
    SnapshotsApi.fetchSnapshot(id1)
      .then((promise: Res<SnapshotDTO>) => {
        if (updateResult) {
          setJsonData(promise?.result?.data);
        }
        setJsonDataSidePanel(promise?.result?.data?.quam ?? {});
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setFetchingSnapshotId(undefined);
      });
    if (updateResult) {
      SnapshotsApi.fetchSnapshotResult(id1)
        .then((promise: Res<object>) => {
          if (promise.result) {
            setResult(promise?.result);
          } else {
            setResult(undefined);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
    if (id2 && fetchUpdate) {
      SnapshotsApi.fetchSnapshotUpdate(id2, id1)
        .then((promise: Res<object>) => {
          if (promise.result) {
            setDiffData(promise?.result);
          } else {
            setDiffData({});
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      setDiffData({});
    }
  };
  // const gitgraphUpdate = () => {
  //   const newArray = allSnapshots.map((res, index) => {
  //     return Object.assign(res, { isSelected: index === selectedSnapshotIndex });
  //   });
  //   setAllSnapshots(newArray);
  // };

  // useEffect(() => {
  //   if (flag) {
  //     setAllSnapshots([]);
  //     const updateFn = setTimeout(() => gitgraphUpdate(), 20);
  //     return () => clearTimeout(updateFn);
  //   }
  // }, [selectedSnapshotIndex, flag]);

  return (
    <SnapshotsContext.Provider
      value={{
        graphIsRunning,
        setGraphIsRunning,
        trackLatestSidePanel,
        setTrackLatestSidePanel,
        trackPreviousSnapshot,
        setTrackPreviousSnapshot,
        totalPages,
        pageNumber,
        setPageNumber,
        allSnapshots,
        setAllSnapshots,

        selectedSnapshotId,
        setSelectedSnapshotId,

        latestSnapshotId,
        setLatestSnapshotId,

        clickedForSnapshotSelection,
        setClickedForSnapshotSelection,

        jsonData,
        setJsonData,
        jsonDataSidePanel,
        setJsonDataSidePanel,
        diffData,
        setDiffData,
        result,
        setResult,
        fetchOneSnapshot,
        firstId,
        setFirstId,
        secondId,
        setSecondId,
        currentWorkflowExecutionId,
        setCurrentWorkflowExecutionId,
        freezeLatestSnapshot,
        setFreezeLatestSnapshot,
        fetchingSnapshotId,
        setFetchingSnapshotId,
      }}
    >
      {props.children}
    </SnapshotsContext.Provider>
  );
}
