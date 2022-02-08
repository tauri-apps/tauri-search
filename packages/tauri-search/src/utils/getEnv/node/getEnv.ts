import { config } from "dotenv";
import { IEnv, Stage } from "~/types";

export function getEnv(): IEnv {
  config();
  return {
    org: process.env.ORG || "tauri-apps",
    repo: process.env.REPO || "tauri-docs",
    branch: process.env.BRANCH || "dev",
    stage: (process.env.NODE_ENV as Stage) || "local",
    docsPath: process.env.DOCS_PATH || "docs",
    tsAstPath: process.env.TS_AST_PATH || "docs/api/js/js-api.json",

    adminKey: process.env.ADMIN_KEY || undefined,
    searchKey: process.env.SEARCH_KEY || undefined,

    github_token: process.env.GH_TOKEN || process.env.GITHUB_TOKEN || undefined,
    github_user: process.env.GH_USER || undefined,
    force: process.env.FORCE ? Boolean(process.env.FORCE) : false,
  };
}
