import { IMeilisearchTaskStatus } from "./meiliseach";

export interface IMonitoredTask {
  /** the document's primary key */
  docId: string;
  /** the task ID assigned by Meilisearch */
  taskId: number;
  status?: string;
  error?: IMeilisearchTaskStatus["error"];
}

export enum TaskStatus {
  working,
  success,
  partialSuccess,
  failure,
  unknown,
  timeout,
}

export interface IMonitoredTaskStatusWorking {
  status: TaskStatus.working;
  /** those documents which have successfully completed the task */
  successful: string[];
  /**
   * the document ID's -- along with a message -- which failed at the given task
   */
  failed: { docId: string; message: string; link?: string }[];
  /** the document ID's which are still waiting to reach a final state */
  incomplete: IMonitoredTask[];
  /** document's which left the "enqueued" state but ended in an unknown/unexpected state */
  unknown: IMonitoredTask[];
  delta: { successful: string[]; failed: string[] };
}

export interface IMonitoredTaskStatusComplete {
  status:
    | TaskStatus.success
    | TaskStatus.failure
    | TaskStatus.partialSuccess
    | TaskStatus.unknown
    | TaskStatus.timeout;
  /** those documents which have successfully completed the task */
  successful: string[];

  failed: { docId: string; message: string; link?: string }[];
  incomplete: IMonitoredTask[];
  /** document's which left the "enqueued" state but ended in an unknown/unexpected state */
  unknown: IMonitoredTask[];
}

export type IMonitoredTaskStatus =
  | IMonitoredTaskStatusWorking
  | IMonitoredTaskStatusComplete;

export interface ITaskStatusOptions {
  timeout?: number;
  callback?: (s: IMonitoredTaskStatus) => void;
}
