import { Stage } from '~/types';

export const TAURI_BASE_URL = `https://tauri.studio`;
export const TAURI_JS_DOCS_URL = `${TAURI_BASE_URL}/api/js`;
export const GITHUB_API_BASE = `https://api.github.com`;
export const REPO_DOCS_CACHE = `src/generated/ast/repo/documents.json`;

export const TS_DOCS_CACHE = `src/generated/ast/api/ts-documents.json`;
export const TS_AST_CACHE = `src/generated/ast/api/ts-ast.json`;
export const RUST_AST_FIXTURE = `test/fixtures/rust-ast.json`;
export const RS_DOCS_CACHE = `src/generated/ast/api/rs-documents.json`;

export const SERVERS: Record<Stage, { url: string; search_key: string }> = {
  local: { url: 'http://localhost:7700', search_key: '' },
  staging: { url: 'https://search2.tauri.studio', search_key: '' },
  production: { url: 'https://search.tauri.studio', search_key: '' },
};

export const REPOS: `${string}/${string}`[] = [
  'tauri-apps/tauri',
  'tauri-apps/wry',
  'tauri-apps/tao',
  'tauri-apps/tauri-action',
  'tauri-apps/tauri-docs',
  'tauri-apps/tauri-vscode',
  'tauri-apps/tauri-plugin-upload',
  'tauri-apps/tauri-plugin-window-state',
  'tauri-apps/tauri-plugin-store',
  'tauri-apps/tauri-plugin-websocket',
  'tauri-apps/tauri-plugin-fs-extra',
  'tauri-apps/tauri-plugin-stronghold',
  'tauri-apps/tauri-plugin-log',
  'tauri-apps/tauri-plugin-sql',
  'tauri-apps/tauri-plugin-shadows',
  'tauri-apps/tauri-plugin-vibrancy',
  'tauri-apps/tauri-plugin-localhost',
  'tauri-apps/tauri-plugin-fs-watch',
  'tauri-apps/tauri-forage',
  'tauri-apps/tauri-hotkey-rs',
  'tauri-apps/tauri-dialog-rs',
  'tauri-apps/tauri-inliner-rs',
  'tauri-apps/tauri-inliner-rs',
  'tauri-apps/rfcs',
  'tauri-apps/tauri-theia',
  'tauri-apps/tauri-toml',
  'tauri-apps/realworld',
  'tauri-apps/governance-and-guidance',
  'tauri-apps/tauri-search-bot',
  'tauri-apps/webkit2gtk-rs',
  'tauri-apps/javascriptcore-rs',
  'tauri-apps/awesome-tauri',
];
