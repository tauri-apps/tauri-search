import { githubMapper } from "~/mappers/githubMapper";
import { RepoModel } from "~/models/RepoModel";
import { MsAddOrReplace } from "~/types";
import { getRepo } from "~/utils/github/getRepo";

const REPOS: `${string}/${string}`[] = [
  "tauri-apps/tauri",
  "tauri-apps/wry",
  "tauri-apps/tao",
  "tauri-apps/tauri-action",
  "tauri-apps/tauri-docs",
  "tauri-apps/tauri-vscode",
  "tauri-apps/tauri-plugin-upload",
  "tauri-apps/tauri-plugin-window-state",
  "tauri-apps/tauri-plugin-store",
  "tauri-apps/tauri-plugin-websocket",
  "tauri-apps/tauri-plugin-fs-extra",
  "tauri-apps/tauri-plugin-stronghold",
  "tauri-apps/tauri-plugin-log",
  "tauri-apps/tauri-plugin-sql",
  "tauri-apps/tauri-plugin-shadows",
  "tauri-apps/tauri-plugin-vibrancy",
  "tauri-apps/tauri-plugin-localhost",
  "tauri-apps/tauri-plugin-fs-watch",
  "tauri-apps/tauri-forage",
  "tauri-apps/tauri-hotkey-rs",
  "tauri-apps/tauri-dialog-rs",
  "tauri-apps/tauri-inliner-rs",
  "tauri-apps/tauri-inliner-rs",
  "tauri-apps/rfcs",
  "tauri-apps/tauri-theia",
  "tauri-apps/tauri-toml",
  "tauri-apps/realworld",
  "tauri-apps/governance-and-guidance",
  "tauri-apps/tauri-search-bot",
  "tauri-apps/webkit2gtk-rs",
  "tauri-apps/javascriptcore-rs",
  "tauri-apps/awesome-tauri",
];

/**
 * Iterates over all marked repos and updates Meilisearch documents
 * associated to them.
 */
export async function githubPipeline() {
  const model = await RepoModel;
  const waitFor: Promise<MsAddOrReplace>[] = [];
  for (const repo of REPOS) {
    const resp = await getRepo(repo);
    waitFor.push(model.query.addOrReplaceDoc(githubMapper.map(resp)));
  }

  await Promise.all(waitFor);
}
