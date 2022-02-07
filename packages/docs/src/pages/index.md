# Getting Started

>>> Install Dependencies and Start Docs Site (_looks like you already did_)
```bash
# 1. installs deps for both CLI and Docs
# 2. starts Docs server (in dev mode with HMR), opens in browser
# 3. starts Meilisearch server in Docker
pnpm run start
```

> A browser window should now have opened to [`http://localhost:3333`](http://localhost:3333).

You are now up and running with the documentation site -- and assuming you have Docker installed -- a local [search server](./meilisearch) which you can interact with.

> Note: the `docker compose` API is new and replaces `docker-compose` ... the API surface is the same though but because this was setup with the new `docker compose` some CLI commands relating to docker may break if you're on the old version (but just manually retype with the dash included)

### Already installed Deps?

If you've already installed all the deps and want more granular control you can choose from the various script targets or just choose _watch_ to look at docs with active editing capability:

```bash
# turn on watcher mode for both CLI and Docs
pnpm run watch
```
>>>
>>> Ways to Consume this library
- **Search Development** - if you are updating docs, index definitions, etc. you'll run this in _watch_ mode (aka., `pnpm run start` (first time) or `pnpm run watch`)
- **Deployment** - When an _upstream_ dependency is updated this repo should be trigged by a Netlify build hook. For instance:
  - `tauri` has a new release to production branch, as a `postbuild` step in Netlify build process, it will call Netlify's API and ask for a rebuild of this repo.
    - we care about picking up the two AST files to build the API docs (`ts-docs.json`, `rust.json`)
  - `tauri-docs` releases new docs, again a `postbuild` hook on Netlify is called to it requests a rebuild from this repo
    - here we need to pickup the directly or MD files
- **NPM Dependency** - the `Models` you've defined along with all of the _types_ defined are available as an NPM dependency
  ```ts
  import { ProseModel } from "tauri-search";
  import type { MeiliSearchResponse } from "tauri-search";
  ```
>>>

## Secrets, ENV variables, and Environments

>>> DotENV
- We use the popular DotEnv **npm** package to allow users to set ENV variables but **not** have them checked into the repository.
- Simply add a `.env` file to add variables you want to use locally; this can be both secret and non-secret variables
>>>
+++ ENV Variables
- >>> `GH_TOKEN` and `GH_USER`
    - Use the `GH_TOKEN` and `GH_USER` env variables to have the Github API's use your personal access token (versus being an anonymous user)
    - If you're using the API anonymously it will quickly use the quota up but once authorized the calls are effectively nothing compared to an authorized API quota
- >>> `REPO`, `BRANCH`, and `DOCS_PATH`
    - the `REPO` variable is used to determine which **Github** repo hosts the Markdown/Prose documents
    - the `BRANCH` variable is used to specify which branch to use
    - the `DOC_PATH` variable indicates where in the repo's directory structure should be 
- >>> `FORCE`
    - by default CLI commands will attempt to leverage file caches as much as is possible but if you set the FORCE property to `true` then no caches will be used
- >>> `MASTER_KEY`, `ADMIN_KEY`, and `SEARCH_KEY`
    - >>> the `MASTER_KEY` should be setup immediately on all production environments as a one time task
        - There is only a single Master Key and unlike other keys, it is not setup via the API but rather using Meilisearch's setup script. 
        - While the Master Key can be passed into the API as bearer token for any endpoint in the API, it probably should only be used to setup other keys
    - +++Production keys:
       - >>> the `ADMIN_KEY` allows for most operations (outside of key management)
          -  you'll need to have this set to push documents or manage indexes on both `staging` and `production` environments
          -  when using the CLI commands to create changes on Meilisearch you'll need to ensure that not only `ADMIN_KEY` is set but that `NODE_ENV` is set to "staging" or "production"
      - >>> the `SEARCH_KEY` only gives access to searching
        -  it gives rights to search but nothing else and while it may block some nefarious traffic it is not considered a "secret"
        -  setting this ENV variable isn't really very useful in this repo as the local Meilisearch doesn't require any keys and you'll need more power to push new documents to a production environment
        -  note the variables below as a more useful alternative

  > **Note:** the interactive playground provides a view into searches but also some ability to modify the local server instance via the API. Regardless of what the `NODE_ENV` is set to it will keep it's focus on the local environment, however, if you set the `VITE_SEARCH_STAGING` or `VITE_SEARCH_PRODUCTION` variables to a search key for those environments then it will allow switching searches to this different environment.
+++

>>> Server Environments
- **LOCAL** - the default environment which both CLI commands and Playground operate on are the dockerized local server running on `http://localhost:7700`.
- **STAGING** - when `NODE_ENV` is set to "staging" the CLI will interact with this env but the Playground will still default to the local environment. Assuming you've provided an `ADMIN_KEY`, however, the Playground will offer some interaction with this env
- **PRODUCTION** - this is the server which has all official search docs/indexes and services the Tauri website. Behaviorly it acts the same as STAGING.
>>>

## Models

Central to using this library to build and refresh your search indexes is understanding the concept of `Model`.
- A Model has a `1:1` relationship with search indexes (or at least _potential_ indexes)
- >>> A Model is intended to represent:
  - the **document structure** that will be used for docs in the index
  - allows for **configuring the index** itself (e.g., stop words, synonyms, etc.)
  - allows you to embed data mappers which map from one document structure to another
  - +++ Take a look at the examples here to get a better bearing:
    - >>> Defining a model:
        ```ts
        /** structure for documents in the Prose index */
        export interface IProse {
          title: string; section: string;
          lastUpdated: number; url: string;
        }
        /** structure for the input data structure */
        export interface IMarkdownAst {
          h1: string; h2: string; h3: string;
          url: string;
        }

        /** create the Prose model */
        const Prose = createModel("prose", c => c //
          .synonomys({ js: ["javascript"], javascript: ["js"]})
          .addMapper("markdown").mapDefn<IMarkdownAst>(i => {
            title: i.h1,
            section: i.h2,
            lastUpdated: i.lastUpdated,
            url: i.url
          })
        )
        ```
    - >>> Using the model to call the MeiliSearch API
      ```ts
      import { Prose } from "./models";
      // create an index
      await Prose.api.createIndex();
      // get index stats
      await Prose.api.stats();
      // search on index 
      await Prose.api.search("foobar");
      ```
    - >>> Mapping data between two known types
      ```ts
      import { Prose } from "./models";

      // map from Input structure to expected document structure
      const doc: IProse = Prose.mapWith("markdown", data);

      // using mapping to perform an update on the index
      await Prose.updateWith("markdown", data);
      ```
      > note: in the examples we're supposing `data` to be a single Node/Record but
      > you can actually pass in either a single record or a list and it will manage
      > both


## External Resources
- >>> Documentation
  - <span class="bg-green-500 rounded px-2 py-1 text-white">GET</span> - [MeiliSearch Website Docs](https://docs.meilisearch.com/learn/what_is_meilisearch/)
  - <span class="bg-green-500 rounded px-2 py-1 text-white">GET</span> - [Open API for MeiliSearch](https://bump.sh/doc/meilisearch)
  - <span class="bg-green-500 rounded px-2 py-1 text-white">GET</span> - [API Docs from MeiliSearch Website](https://docs.meilisearch.com/reference/api/)
  - <span class="bg-green-500 rounded px-2 py-1 text-white">GET</span> - [Postman Collection of MeiliSearch API](https://docs.meilisearch.com/postman/meilisearch-collection.json)
- Interactive
  - <span class="bg-green-500 rounded px-2 py-1 text-white">GET</span> - [MeiliSearch Dashboard](http://localhost:7700/)

