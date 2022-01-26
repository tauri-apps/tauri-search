# Getting Started

```bash
# install npm dependencies (in all repos)
pnpm run start
# start Docker services (you must have Docker installed)
docker compose up
# bring up documentation / playground site
pnpm run dev
```

You are now up and running with the documentation site and assuming your Docker services also started up -- the [search server](./meilisearch) and [scraper utility](./scraper) -- then you will be able to start trying out searches immediately.

## Search API

The MeilliSearch API is fully captured as a **Postman** collection, you can [download it here](). The [documentation can be found here](https://docs.meilisearch.com/learn/what_is_meilisearch/). Also check out the [full API Docs from MeiliSearch](https://docs.meilisearch.com/reference/api/) and again in [Open API doc format](https://bump.sh/doc/meilisearch).

## URLs

- <span class="bg-green-500 rounded px-2 py-1 text-white">GET</span> - [Documentation site with Playground](http://localhost:3333)
- <span class="bg-green-500 rounded px-2 py-1 text-white">GET</span> - [MeiliSearch Dashboard](http://localhost:7700/)