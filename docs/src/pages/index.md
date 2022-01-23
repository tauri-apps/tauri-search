# Getting Started

+++ Install Dependencies and Start Docs Site (_looks like you already did_)
```bash
# install npm dependencies (in all repos)
pnpm run start
# start Docker services (you must have Docker installed)
docker compose up
# bring up documentation / playground site
pnpm run dev
```
A browser window should now have openned up pointing to `http://localhost:3333`.

You are now up and running with the documentation site and assuming your Docker services also started up -- the [search server](./meilisearch) and [scraper utility](./scraper) -- then you will be able to start trying out searches immediately.
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