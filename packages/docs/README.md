# Getting Started

```bash
# install npm dependencies (in all repos)
pnpm run start
# start Docker services (you must have Docker installed)
docker compose up -d
# bring up documentation / playground site
pnpm run dev
```

You are now up and running with the documentation site and assuming your Docker services also started up -- the [search server](https://docs.meilisearch.com/) and [scraper utility](https://github.com/meilisearch/docs-scraper) -- then you will be able to start trying out searches immediately.

> If for some reason your browser didn't open to [http://localhost:3333](http://localhost:3333) please redirect yourself there now.