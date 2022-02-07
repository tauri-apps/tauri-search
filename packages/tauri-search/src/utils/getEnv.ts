import { config } from "dotenv";

export type Stage = "production" | "staging" | "local" | undefined;
export interface IEnv {
  org: string;
  repo: string;
  branch: string;

  stage: Stage;

  docsPath: string;
  github_token?: string;
  github_user?: string;
  force?: boolean;
}

export function getEnv(): IEnv {
  config();
  return {
    org: process.env.ORG || "tauri-apps",
    repo: process.env.REPO || "tauri-docs",
    branch: process.env.BRANCH || "dev",
    stage: process.env.NODE_ENV as Stage,
    docsPath: process.env.DOCS_PATH || "docs",
    github_token: process.env.GH_TOKEN || process.env.GITHUB_TOKEN || undefined,
    github_user: process.env.GH_USER || undefined,
    force: process.env.FORCE ? Boolean(process.env.FORCE) : false,
  };
}
