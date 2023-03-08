> **Note**
> This repo has been archived. Visit [tauri-apps/meilisearch-docsearch](https://github.com/tauri-apps/meilisearch-docsearch) for the new UI component or [tauri-apps/tauri-docs](https://github.com/tauri-apps/tauri-docs) for updated search indexing.

# tauri-search

> use of Meilisearch for Tauri's website

## Getting Started

```bash
# 1. installs deps for both CLI and Docs
# 2. starts Docs server (in dev mode with HMR), opens in browser
# 3. starts Meilisearch server in Docker
pnpm run start
```

If you've already installed all the deps and want more granular control you can try any of the following script targets:

```bash
# start Docker services (you must have Docker installed)
docker compose up -d
# or
pnpm run up

# stop Docker services
docker compose down
# or
pnpm run down

# turn on watcher mode for both CLI and Docs
pnpm run watch
```

A browser window should now have opened up pointing to `http://localhost:3333`. See you over there.

## Quick CLI overview

For those who aren't impressed with browser based documentation ... here's a quick guide to the _script_ commands you can use from the root of the monorepo:

- `pnpm run watch` - start up dev server in HMR mode, and put watchers on all code in `tauri-search`
- `pnpm run build` - build both CLI and npm exports of `tauri-search` package
- `pnpm run cli:clear-caches` - removes all JSON based cache files of AST or search Documents from `tauri-search`
- `pnpm run cli:push-caches` - will create caches (where necessary) and push them into the local Meilisearch server
- `pnpm run test` - runs the terminal test runner once and exits
- `pnpm run test:watch` - runs test runner in both console and web browser and watches for changes
