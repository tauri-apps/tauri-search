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

## Models

Central to using this library to build and refresh your search indexes is understanding the concept of `Model`.
- A Model has a `1:1` relationship with search indexes (or at least _potential_ indexes)
- A Model is intended to represent:
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
- General Documentation
  - <span class="bg-green-500 rounded px-2 py-1 text-white">GET</span> - [MeiliSearch Website Docs](https://docs.meilisearch.com/learn/what_is_meilisearch/)
- API Docs
  - <span class="bg-green-500 rounded px-2 py-1 text-white">GET</span> - [Open API for MeiliSearch](https://bump.sh/doc/meilisearch)
  - <span class="bg-green-500 rounded px-2 py-1 text-white">GET</span> - [API Docs from MeiliSearch Website](https://docs.meilisearch.com/reference/api/)
  - <span class="bg-green-500 rounded px-2 py-1 text-white">GET</span> - [Postman Collection of MeiliSearch API](https://docs.meilisearch.com/postman/meilisearch-collection.json)
- Interactive
  - <span class="bg-green-500 rounded px-2 py-1 text-white">GET</span> - [MeiliSearch Dashboard](http://localhost:7700/)