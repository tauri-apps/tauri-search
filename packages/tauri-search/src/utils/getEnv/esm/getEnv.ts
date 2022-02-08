/* eslint-disable no-console */
import { IEnv, Stage } from "~/types";

export function getEnv(): IEnv {
  try {
    const env = (process.env.NODE_ENV || "local").toLowerCase() as Stage;
    return {
      org: (import.meta?.env?.ORG as string) || "tauri-apps",
      repo: (import.meta?.env?.REPO as string) || "tauri-docs",
      branch: (import.meta?.env?.BRANCH as string) || "dev",
      stage: (import.meta?.env?.NODE_ENV as Stage) || "local",
      docsPath: (import.meta?.env?.DOCS_PATH as string) || "docs",
      tsAstPath: (import.meta?.env?.TS_AST_PATH as string) || "docs/api/js/js-api.json",

      adminKey:
        import.meta?.env && typeof import.meta?.env === "object"
          ? (import.meta?.env[`${env.toUpperCase()}_ADMIN_KEY`] as string)
          : undefined,
      searchKey:
        import.meta?.env && typeof import.meta?.env === "object"
          ? (import.meta?.env[`${env.toUpperCase()}_SEARCH_KEY`] as string)
          : undefined,

      github_token:
        (import.meta?.env?.GH_TOKEN as string | undefined) ||
        (import.meta?.env?.GITHUB_TOKEN as string | undefined) ||
        undefined,
      github_user: (import.meta?.env?.GH_USER as string | undefined) || undefined,
      force: import.meta?.env?.FORCE ? Boolean(import.meta?.env?.FORCE) : false,
    };
  } catch (err) {
    console.warn(`- problems using imports.meta to get ENV variables; skipping for now`);
    return {
      org: (import.meta?.env?.ORG as string) || "tauri-apps",
      repo: (import.meta?.env?.REPO as string) || "tauri-docs",
      branch: (import.meta?.env?.BRANCH as string) || "dev",
      stage: (import.meta?.env?.NODE_ENV as Stage) || "local",
      docsPath: (import.meta?.env?.DOCS_PATH as string) || "docs",
      tsAstPath: (import.meta?.env?.TS_AST_PATH as string) || "docs/api/js/js-api.json",
    };
  }
}
