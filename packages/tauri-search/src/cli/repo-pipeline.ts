import { githubPipeline } from "~/pipelines/githubPipeline";

(async () => {
  await githubPipeline();
})();
