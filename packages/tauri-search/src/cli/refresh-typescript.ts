/* eslint-disable no-console */
import { TS_AST_CACHE, TS_DOCS_CACHE } from "~/constants";
import { refreshTypescript } from "~/pipelines/refreshTypescript";
import { getEnv } from "~/utils/getEnv";

(async () => {
  const { repo, branch } = getEnv();
  console.log(`- refreshing Typescript ASTs and Docs cache`);
  const docs = await refreshTypescript(repo, branch);
  console.log(`- completed caching of ${docs.length} TS API documents:`);
  console.log(`    - AST Cache: ${TS_AST_CACHE}`);
  console.log(`    - Doc Cache: ${TS_DOCS_CACHE}`);
  console.log();
})();
