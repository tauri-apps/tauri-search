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
docker compose up
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


## Content Types



+++ **1. API Documents**
- RUST indexes
  - _will create index references to all **RUST symbols** and home page_
    - [Home Page](https://docs.rs/tauri/latest/tauri/) plus sections in home page
      - [Re-exports](https://docs.rs/tauri/latest/tauri/#reexports)
      - [Modules](https://docs.rs/tauri/latest/tauri/#modules)
      - [Structs](https://docs.rs/tauri/latest/tauri/#structs)
      - [Functions](https://docs.rs/tauri/latest/tauri/#functions)
      - [Type Definitions](https://docs.rs/tauri/latest/tauri/#types)
    - **Re-Exports**
      - [`tauri-api`](https://docs.rs/tauri-api/latest/tauri_api/index.html)
    - **Modules**:
      - [`command`](https://docs.rs/tauri-api/latest/tauri_api/command/index.html)
      - [`http`](https://docs.rs/tauri-api/latest/tauri_api/http/index.html)
      - etc.
    - **Functions**: 
      - [`make_request`](https://docs.rs/tauri-api/latest/tauri_api/http/fn.make_request.html)
      - 
    - **Enums**
      - [`http::ResponseType`](https://docs.rs/tauri-api/latest/tauri_api/http/enum.ResponseType.html)
      - [`tauri_api::dialog::Response`](https://docs.rs/tauri-api/latest/tauri_api/dialog/enum.Response.html)
      - etc.
    - **Type Definitions**:
      - [`Result`](https://docs.rs/tauri/latest/tauri/type.Result.html)
      - etc.
  - _all indexes will point directly to `docs.rs`_
- Typescript indexes
  - _we will host the API docs on [Tauri's Website](https://tauri.studio) and all search indexes will point there_
  - indexes will largely mirror what we are doing on the Rust side
+++

- **Primary / Prose Documentation**
  - _all sections will be authored in English and using Markdown format_
  - _we will need separate indexes for `i18n` content_
  - _All documentation outside of generated API docs will be considered part of this section_
  - The current site includes these areas:
    - About
    - Docs section
    - Community
    - Configuration

## Indexes

### [Meilisearch Index Overview](https://docs.meilisearch.com/learn/core_concepts/indexes.html#index-creation)



### [Meilisearch Relevance Overview](https://docs.meilisearch.com/learn/core_concepts/relevancy.html)

Meilisearch provides **Ranking Rules** which you can use to help tune each index's strategy. The default rule ordering is as follows (most significant first):

1. Words
1. Typo
1. Proximity
1. Attribute
1. Sort
1. Exactness

Rule #4 above -- `Attribute` -- points to another ranking system: **Attribute Ranking**. Attribute Ranking allows you to state the order of importance of each attribute in a document.

### Tauri Indexes

- `rust` - 
- `typescript` - 
- `docs` - we may break this up into further indexes later but best to start with the KISS principle

## Documents

Documents are key-value pairs (referred to as attribute/value in Meili speak). 

- The "Primary Field" is the only _required_ attribute/value pair. It will always have a key of `id` and it's value contains the primary key and document identifier.
- Data can be ingested in any of the three formats:
  - JSOn
  - [NDJSON](https://docs.meilisearch.com/learn/core_concepts/documents.html#ndjson)
  - CSV
- In general we should prefer NDJSON where possible as it has better performance than JSON and also allows for nested data.

## Deployment Environments

You can test everything locally by firing up the included Docker compose configuration: `docker compose up` but for production Meilisearch has three pre-configured setups that Meilisearch provides:

- [AWS](https://github.com/meilisearch/meilisearch-aws)
- [Digital Ocean](https://github.com/meilisearch/meilisearch-digitalocean)
- [GCP](https://github.com/meilisearch/meilisearch-gcp)

I prefer AWS out of familiarity but also:
- arguably their investment in Rust might facilitate future synergies
- since we use Netlify for hosting and Netlify uses AWS for functions and basic CDN (advanced CDN is via Cloudflare)

That said, we probably need to consider Digital Ocean too simply because that is the status quo. I'd avoid GCP.

> Note: for local experimentation you can use the Meilisearch API directly at http://localhost:7700 or fire up the demo app with `pnpm run demo`