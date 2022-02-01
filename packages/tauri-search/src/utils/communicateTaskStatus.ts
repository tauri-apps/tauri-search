/* eslint-disable no-console */
import { IMonitoredTask, ISearchModel, ITaskStatusOptions, TaskStatus } from "~/types";
import { monitorTasks } from "./monitorTasks";

export async function communicateTaskStatus(
  model: ISearchModel<any>,
  tasks: IMonitoredTask[],
  options: ITaskStatusOptions = {}
) {
  const final = await monitorTasks(model, tasks, options);
  console.log();

  switch (final.status) {
    case TaskStatus.unknown:
      console.log(
        `- there were ${final.unknown.length} documents which ended in an unknown/unexpected state`
      );
      console.log(
        `    - ${final.unknown.map((i) => `${i.docId}[${i.status}, ${i.taskId}]`)}`
      );
      console.log(`- there were also ${final.successful.length} successful ingestions`);
      if (final.failed.length > 0) {
        console.log(`- but also ${final.failed.length} failed ingestions`);
      }
      process.exit(1);

    case TaskStatus.success:
      console.log(`- all documents successfully ingested by MeiliSearch`);
      break;

    case TaskStatus.partialSuccess:
      console.log(
        `- ${final.successful.length} documents were ingested successfully but ${final.failed.length} failed. Failures detailed below:`
      );
      console.log(
        final.failed
          .map((f) => `${f.docId}: ${f.link || "<no help URL>"}\t${f.message}`)
          .join("\n")
      );
      process.exit(1);

    case TaskStatus.timeout:
      console.log(`- The full set of documents was not completed in the TIMEOUT window.`);
      console.log(`- ${final.successful.length} documents were ingested successfully`);
      if (final.failed.length > 0) {
        console.log(
          `-e ${final.failed.length} documents failed to ingest: ${final.failed
            .map((f) => `${f.docId}[${f.link}]`)
            .join(", ")}`
        );
      }
      if (final?.unknown?.length > 0) {
        console.log(
          `- there were ${final.unknown.length} documents which ended in an unknown/unexpected state`
        );
        console.log(
          `    - ${final.unknown.map((i) => `${i.docId}[${i.status}, ${i.taskId}]`)}`
        );
      }
      console.log(
        `- ${
          final.incomplete.length
        } documents did not complete before the timeout:\n\t${final.incomplete
          .map((i) => `${i.docId}[${i.taskId}]`)
          .join(", ")}`
      );
      break;

    default:
      process.exit(1);
  }
}
