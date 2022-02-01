/* eslint-disable no-use-before-define */
import {
  IMonitoredTask,
  IMonitoredTaskStatus,
  IMonitoredTaskStatusComplete,
  IMonitoredTaskStatusWorking,
  ISearchModel,
  ITaskStatusOptions,
  TaskStatus,
} from "~/types";
import { wait } from "./wait";

function defaultCallback(status: IMonitoredTaskStatus) {
  if (areWorkingTasks(status)) {
    for (const _s of status.delta.successful) {
      process.stdout.write(".");
    }
    for (const _f of status.delta.failed) {
      process.stdout.write("x");
    }
  }
}

export function areCompletedTasks(
  status: IMonitoredTaskStatus
): status is IMonitoredTaskStatusComplete {
  return status.status !== TaskStatus.working;
}

export function areWorkingTasks(
  status: IMonitoredTaskStatus
): status is IMonitoredTaskStatusWorking {
  return status.status === TaskStatus.working;
}

async function getStatus(
  model: ISearchModel<any>,
  tasks: IMonitoredTask[],
  prior?: IMonitoredTaskStatus
): Promise<IMonitoredTaskStatus> {
  if (prior && areCompletedTasks(prior)) {
    throw new Error(`Completed tasks sent to getStatus()!`);
  }
  const waitFor: Promise<IMonitoredTask>[] = [];

  for (const t of tasks) {
    waitFor.push(
      model.query.getTask(t.taskId).then((task) => ({
        taskId: t.taskId,
        docId: t.docId,
        status: task?.status,
        error: task?.error,
      }))
    );
  }
  const results = await Promise.all(waitFor);
  const successful = results.filter((r) => r.status === "succeeded").map((i) => i.docId);
  const failed = results
    .filter((r) => r.status === "failed")
    .map((i) => ({
      docId: i.docId,
      message: i?.error?.message || "unknown",
      link: i?.error?.link,
    }));
  const incomplete = results.filter((r) =>
    ["enqueued", "processing"].includes(r.status || "__")
  );
  const unknown = results.filter(
    (r) => !["enqueued", "processing", "succeeded", "failed"].includes(r.status || "___")
  );
  const status =
    incomplete.length > 0
      ? TaskStatus.working
      : unknown.length > 0
      ? TaskStatus.unknown
      : failed.length === 0
      ? TaskStatus.success
      : results.length === 0
      ? TaskStatus.failure
      : TaskStatus.partialSuccess;

  return (
    status === TaskStatus.working
      ? ({
          status,
          successful: [...successful, ...(prior?.successful || [])],
          failed: [...failed, ...(prior?.failed || [])],
          incomplete,
          unknown,
          delta: {
            successful: prior
              ? successful.filter((i) => !prior.successful.includes(i))
              : successful,
            failed: prior
              ? failed
                  .map((i) => i.docId)
                  .filter((i) => !prior.failed.map((f) => f.docId).includes(i))
              : failed,
          },
        } as IMonitoredTaskStatusWorking)
      : ({
          status,
          successful,
          failed,
          unknown,
          incomplete,
        } as IMonitoredTaskStatusComplete)
  ) as IMonitoredTaskStatus;
}

export const monitorTasks = async (
  model: ISearchModel<any>,
  tasks: IMonitoredTask[] | IMonitoredTask,
  options: ITaskStatusOptions
): Promise<IMonitoredTaskStatusComplete> => {
  const DEFAULT_TIMEOUT = 60000;
  const INITIAL_DELAY = 500;
  const POLLING_INTERVAL = 250;
  const [TIMEOUT, statusCallback] = [
    options.timeout || DEFAULT_TIMEOUT,
    options.callback || defaultCallback,
  ];

  const isArray = Array.isArray(tasks);
  const t = !isArray
    ? ([tasks] as unknown as IMonitoredTask[])
    : (tasks as unknown as IMonitoredTask[]);

  let status = await getStatus(model, t);
  const start = Date.now();
  await wait(INITIAL_DELAY);

  while (Date.now() - start < TIMEOUT && areWorkingTasks(status)) {
    status = await getStatus(model, status.incomplete, status);
    if (statusCallback) {
      statusCallback(status);
    }
    await wait(POLLING_INTERVAL);
  }

  return areCompletedTasks(status)
    ? status
    : {
        status: TaskStatus.timeout,
        successful: status.successful,
        failed: status.failed,
        unknown: status.unknown,
        incomplete: status.incomplete,
      };
};
