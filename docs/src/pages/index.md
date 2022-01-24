# Getting Started

+++ Install Dependencies and Start Docs Site (_looks like you already did_)
```bash
# 1. installs deps for both CLI and Docs
# 2. starts Docs server (in dev mode with HMR), opens in browser
# 3. starts Meilisearch server in Docker
pnpm run start
```

> A browser window should now have opened to [`http://localhost:3333`](http://localhost:3333).

You are now up and running with the documentation site -- and assuming you have Docker installed -- a local [search server](./meilisearch) which you can interact with.

### Already installed Deps?

If you've already installed all the deps and want more granular control you can choose from the various script targets or just choose _watch_ to look at docs with active editing capability:

```bash
# turn on watcher mode for both CLI and Docs
pnpm run watch
```
+++



## Sitemap

Use the Nav bar at the top to navigation to the various sections:

- MeiliSearch Info
- Search Bar Info
- Docker Info

Then we move into the core content types:

- Typescript API Content
- Rust API Content
- Prose Content


## External Resources
- General Documentation
  - <span class="bg-green-500 rounded px-2 py-1 text-white">GET</span> - [MeiliSearch Website Docs](https://docs.meilisearch.com/learn/what_is_meilisearch/)
- API Docs
  - <span class="bg-green-500 rounded px-2 py-1 text-white">GET</span> - [Open API for MeiliSearch](https://bump.sh/doc/meilisearch)
  - <span class="bg-green-500 rounded px-2 py-1 text-white">GET</span> - [API Docs from MeiliSearch Website](https://docs.meilisearch.com/reference/api/)
  - <span class="bg-green-500 rounded px-2 py-1 text-white">GET</span> - [Postman Collection of MeiliSearch API](https://docs.meilisearch.com/postman/meilisearch-collection.json)
- Interactive
  - <span class="bg-green-500 rounded px-2 py-1 text-white">GET</span> - [MeiliSearch Dashboard](http://localhost:7700/)