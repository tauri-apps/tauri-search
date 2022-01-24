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

