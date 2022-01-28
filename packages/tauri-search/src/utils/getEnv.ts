import { config } from "dotenv";

export function getEnv() {
  config();
  return {
    repo: process.env.REPO || "tauri",
    branch: process.env.BRANCH || "dev",
    github_token: process.env.GITHUB_TOKEN || undefined,
    github_user: process.env.GITHUB_USER || undefined,
    force: process.env.FORCE ? Boolean(process.env.FORCE) : false,
  };
}
