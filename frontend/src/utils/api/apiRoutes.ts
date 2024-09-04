export const ALL_SNAPSHOTS = ({ branchName = "main", pageNumber = 1, pageLimit = 100, reverseOrder = true, globalReverse = false }) =>
  "api/branch/" +
  branchName +
  "/snapshots_history?page=" +
  pageNumber +
  "&per_page=" +
  pageLimit +
  "&reverse=" +
  reverseOrder +
  "&global_reverse=" +
  globalReverse;
export const ONE_SNAPSHOT = (snapshotId: string) => `api/snapshot/${snapshotId}/`;
export const SNAPSHOT_RESULT = (snapshotId: string) => `api/data_file/${snapshotId}/content`;
export const SNAPSHOT_DIFF = (currentSnapshotId: string, newSnapshotId: string) =>
  `api/snapshot/${currentSnapshotId}/compare?id_to_compare=${newSnapshotId}`;
export const UPDATE_SNAPSHOT = (id: string) => `api/snapshot/${id}/update_entry`;
export const ALL_PROJECTS = () => "api/projects/list";
export const ACTIVE_PROJECT = () => "api/projects/active";
export const IS_NODE_RUNNING = () => "execution/is_running";
export const STOP_NODE_RUNNING = () => "api/execution/stop";
export const ALL_NODES = () => "execution/get_nodes";
export const GET_NODE = () => "execution/get_node";
export const ALL_GRAPHS = () => "execution/get_graphs";
export const GET_GRAPH = () => "execution/get_graph";
export const GET_WORKFLOW_GRAPH = () => "execution/get_graph/cytoscape";
export const GET_EXECUTION_HISTORY = () => "execution/last_run/workflow/execution_history";
export const SUBMIT_NODE_RUN = () => "execution/submit/node";
export const SUBMIT_WORKFLOW_RUN = () => "execution/submit/workflow";
export const GET_LAST_RUN = () => "execution/last_run/";
