import { IEnv, Stage } from "~/types";

export function getEnv(): IEnv {
  return {
    org: (import.meta?.env?.ORG as string) || "tauri-apps",
    repo: (import.meta?.env?.REPO as string) || "tauri-docs",
    branch: (import.meta?.env?.BRANCH as string) || "dev",
    stage: (import.meta?.env?.NODE_ENV as Stage) || "local",
    docsPath: (import.meta?.env?.DOCS_PATH as string) || "docs",
    tsAstPath: (import.meta?.env?.TS_AST_PATH as string) || "docs/api/js/js-api.json",

    adminKey:
      (import.meta?.env?.ADMIN_KEY as string) ||
      (import.meta?.env?.VITE_ADMIN_KEY as string) ||
      undefined,
    searchKey:
      (import.meta?.env?.SEARCH_KEY as string) ||
      (import.meta?.env?.VITE_SEARCH_KEY as string) ||
      undefined,

    github_token:
      (import.meta?.env?.GH_TOKEN as string | undefined) ||
      (import.meta?.env?.GITHUB_TOKEN as string | undefined) ||
      undefined,
    github_user: (import.meta?.env?.GH_USER as string | undefined) || undefined,
    force: import.meta?.env?.FORCE ? Boolean(import.meta?.env?.FORCE) : false,
  };
}
