/* eslint-disable no-console */
import { existsSync } from "node:fs";
import { REPO_DOCS_CACHE, TS_DOCS_CACHE } from "~/constants";
import { ApiModel, ConsolidatedModel, ProseModel, RepoModel } from "~/models";
import {
  pushProseDocs,
  pushRepoDocs,
  pushTypescriptDocs,
  refreshRepos,
  refreshTypescript,
} from "~/pipelines";
import { pushConsolidatedDocs } from "~/pipelines/pushConsolidatedDocs";
import { communicateTaskStatus } from "~/utils/communicateTaskStatus";

(async () => {
  console.log(`- Pushing ALL document caches into local MeiliSearch server`);
  const idx = (await ApiModel().query.currentIndexes()).map((i) => i.name);
  if (idx.length > 0) {
    console.log(
      `- found the following indexes setup: ${idx.join(
        ", "
      )}. They will not be restarted but missing indexes will be added as per the Model configuration.`
    );
  }

  [ApiModel(), RepoModel(), ProseModel(), ConsolidatedModel()].forEach(async (model) => {
    if (!idx.includes(model.name)) {
      console.log(
        `- creating the "${model.name}" index with the following config: ${JSON.stringify(
          { ...model.index, stopWords: `${model.index?.stopWords?.length || 0} words` }
        )}`
      );
      await model.query.createIndex();
    }
  });

  console.log(`- Pushing "prose" documents to MeiliSearch`);
  const proseTasks = await pushProseDocs();
  console.log(
    `- all ${proseTasks.length} documents were pushed via API; monitoring task status ...`
  );

  await communicateTaskStatus(ProseModel(), proseTasks, { timeout: 45000 });

  console.log(`- Pushing Repo document cache into MeiliSearch`);

  if (!existsSync(REPO_DOCS_CACHE)) {
    console.log("- No cache for Repo documents found, so refreshing cache first");
    await refreshRepos();
  }
  const { docs, errors, tasks: repoTasks } = await pushRepoDocs();
  console.log();
  if (errors.length > 0) {
    console.log(
      `- Completed pushing Repo docs to MeiliSearch but ${errors.length} of ${
        docs.length
      } encountered errors:\n\t${errors.map((e) => e.name).join(", ")}`
    );
    process.exit(1);
  } else {
    console.log(
      `- Completed pushing all ${docs.length} Repo docs to MeiliSearch; monitoring queue status`
    );

    await communicateTaskStatus(RepoModel(), repoTasks);

    if (!existsSync(TS_DOCS_CACHE)) {
      console.log(`- The Typescript documents cache wasn't found; creating first`);
      await refreshTypescript();
    }

    console.log(`- Starting update process for Typescript API documents`);
    const { errors, tasks } = await pushTypescriptDocs();
    console.log();

    if (errors.length > 0) {
      console.log(
        `- Completed pushing Typescript docs to MeiliSearch but ${errors.length} of ${
          tasks.length
        } encountered errors and were not processed:\n\t${errors
          .map((e) => e.name)
          .join(", ")}`
      );
      process.exit(1);
    } else {
      console.log(
        `- Completed pushing all Typescript docs [${tasks.length}] to MeiliSearch. Now monitoring task progress ...`
      );
      communicateTaskStatus(ApiModel(), tasks, { timeout: 45000 });
    }

    const { tasks: consolidatedTasks } = await pushConsolidatedDocs();
    console.log();
    console.log(
      `- all consolidated documents [${tasks.length}] have been pushed to MeiliSearch queue`
    );

    communicateTaskStatus(ConsolidatedModel(), consolidatedTasks, { timeout: 75000 });
  }
})();
