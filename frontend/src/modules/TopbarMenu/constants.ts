export interface LastRunStatusGraphResponseDTO {
  name: string;
  status: string;
  run_start: string;
  run_end: string;
  total_nodes: number;
  finished_nodes: number;
  run_duration: number;
  percentage_complete: number;
  time_remaining: number | null;
}

export interface LastRunStatusNodeResponseDTO {
  status: string;
  run_start: string;
  run_duration: number;
  name: string;
  id?: number;
  percentage_complete: number;
  current_action?: string | null;
  time_remaining: number | null;
}

export const fallbackNode: LastRunStatusNodeResponseDTO = {
    status: "pending",
    run_start: "",
    run_duration: 0,
    name: "",
    percentage_complete: 0,
    time_remaining: 0,
};

export const fallbackGraph: LastRunStatusGraphResponseDTO = {
    name: "",
    status: "pending",
    run_start: "",
    run_end: "",
    total_nodes: 1,
    finished_nodes: 0,
    run_duration: 0,
    percentage_complete: 0,
    time_remaining: 0,
};

export const GRAPH_STATUS = {
  RUNNING: "running",
  FINISHED: "finished",
  ERROR: "error",
  PENDING: "pending",
};
export const NODE_STATUS = {
  RUNNING: "running",
  FINISHED: "finished",
  ERROR: "error",
  PENDING: "pending",
};

export const DEFAULT_TOOLTIP_SX = {
  backgroundColor: "#42424C",
  padding: "12px",
  borderRadius: "6px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  fontSize: "0.85rem",
  lineHeight: "1.3",
};
