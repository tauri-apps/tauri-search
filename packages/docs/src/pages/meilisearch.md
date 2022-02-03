# Meilisearch Documentation

## Architecture

Pictures are worth 1,000 words (good ones anyway), so let's stop writing prose.

- >>>High Level Interaction Diagram
  ADD PICTURE
- >>>Content Flow
  ADD PICTURE

## Documents and Indexes
> A document is an object composed of one or more fields. Each field consists of an attribute and its associated value. Documents function as containers for organizing data, and are the basic building blocks of a MeiliSearch database. To search for a document, it must first be added to an index.

A document (or set of documents) is the intended _result_ of a search operation and each document is represented as a typical key/value document. The only required property is the **Primary Key** but for Tauri we will use "models" for each content-type that we search for.

- >>> About the Primary Key
  - For Tauri search we always explicitly state the "field" that will be the primary key in a document. This is done during index creation before documents are loaded.
  - If you wanted to you could just load a set of documents and MeiliSearch would _infer_ the primary key for you. But inference is for people who fear commitment ... or at least that's what we think. :)
- >>> How do we _model_ a content-type?
  - First off a "model" in this case defines three things:
    1. the **structure** of the documents we will write for this content type, 
    2. a **mapping** from the content it will receive as an _input_ to the the desired doc structure
    3. the **configuration of the index** for this content-type
  - Let's look at two simple examples where we'll leave the index configuration set to all default values.
    - Our "prose" documentation a little something like this:
      ```ts
      export default createModel<Input = any, Index = any>("prose", i => {
        title: i => i.title || i.h1,
        section: i => i.h2,
        url: i => proseUrl(i),
      });
      ```
    - in this case the typing for both the input and mapped output will be strongly typed assuming you set the generic types
    - if you don't set the generic types you are -- loosely speaking -- a glass half-empty person
    - we'll go into a bit more detail in each of the key content areas: TS Api, RS Api, and prose Markdown.

### Indexes
> An index is an entity that gathers a set of documents with its own settings. It can be comparable to a table in SQL, or a collection in MongoDB.

Where a document is possible answer, an index provides a means for us to efficiently and effectively get the right answers.

## Content Types

To build a good index, we must first think about the _types_ of content we will be indexing. This section will give a full overview of this and then we'll move into how this translates into Meilisearch Indexes.

- +++ **API Documents**
  - >>> RUST indexes
      - +++ _will create index references to all **RUST symbols** and home page_
        - [Home Page](https://docs.rs/tauri/latest/tauri/) plus sections in home page
        - [Re-exports](https://docs.rs/tauri/latest/tauri/#reexports)
        - [Modules](https://docs.rs/tauri/latest/tauri/#modules)
        - [Structs](https://docs.rs/tauri/latest/tauri/#structs)
        - [Functions](https://docs.rs/tauri/latest/tauri/#functions)
        - [Type Definitions](https://docs.rs/tauri/latest/tauri/#types)
      - +++ **Re-Exports**
        - [`tauri-api`](https://docs.rs/tauri-api/latest/tauri_api/index.html)
      - +++ **Modules**
        - [`command`](https://docs.rs/tauri-api/latest/tauri_api/command/index.html)
        - [`http`](https://docs.rs/tauri-api/latest/tauri_api/http/index.html)
        - etc.
      - +++ **Functions** 
        - [`make_request`](https://docs.rs/tauri-api/latest/tauri_api/http/fn.make_request.html)
        - etc.
      - +++ **Enums**
        - [`http::ResponseType`](https://docs.rs/tauri-api/latest/tauri_api/http/enum.ResponseType.html)
        - [`tauri_api::dialog::Response`](https://docs.rs/tauri-api/latest/tauri_api/dialog/enum.Response.html)
        - etc.
      - +++ **Type Definitions**
        - [`Result`](https://docs.rs/tauri/latest/tauri/type.Result.html)
        - etc.
    - _all indexes will point directly to `docs.rs`_
  - >>> Typescript indexes
      - _we will host the API docs on [Tauri's Website](https://tauri.studio) and all search indexes will point there_
      - indexes will largely mirror what we are doing on the Rust side
- +++ **Primary / Prose Documentation**
  - _all sections will be authored in English and using Markdown format_
  - _we will need separate indexes for `i18n` content_
  - _All documentation outside of generated API docs will be considered part of this section_
  - >>> The current site includes these areas:
    - About
    - Docs section
    - Community
    - Configuration

## Meilisearch Indexing

### General Info

- +++ The following notes are high-level info on indexing in general
  - >>>The `uid`
    - Indexes must have a unique ID -- referred to as `uid`
    - Once the `uid` has been created it may not be changed
    - The `uid` is not the primary_key:
      - the `uid` uniquely identifies the **index**
      - the `primary key` uniquely identifies an incoming record for a given index
  - >>> Primary Keys
    - The primary key can be _inferred_ simply by loading documents but in general it's better to explicity set it through the API
      - `POST /indexes`
        ```sh
        curl \
          -X POST 'http://localhost:7700/indexes' \
          -H 'Content-Type: application/json' \
          --data-binary '{
            "uid": "movies",
            "primaryKey": "reference_number"
          }'
        ```
    - even though in the example above we stated the `primaryKey` to be **reference_number**, the index will store this reference_number along with other properties in a "document" where the unique identifier is `id`.
  - Note: **indexes** should always be setup _before_ we load documents against that index
- Official docs can be found here: [Meilisearch Indexing](https://docs.meilisearch.com/learn/core_concepts/indexes.html#index-creation)

### Tauri Site

For the **Tauri** site it is proposed that we use the following indexes:

- +++ Rust API Docs
  - all indexes will point to [**docs.rs**](https://docs.rs/tauri/latest/tauri/) site
  - documents are generated automatically when publishing the crate
  - 
- +++ Typescript API Docs
  - on the core **Tauri** repo:
    - a `post-build` step of a Netlify publication to production **TSDoc** will be called to output JSON output and then trigger a rebuild of `tauri-
  -  
- +++ Docs
  - this consists of all the Markdown content which ends up on the site:
    - >>> About
      - What is Tauri
      - Security
      - Governance
      - Get the Book
      - Benchmarks
    - >>> Docs
      - Getting Started
      - Development
      - Guides
    - >>> Community
      - Showcase
      - Partners
      - (future: Press Releases)
    - >>> Repos
      - we might as well well add index to Github repos which are related to project
      - this would include **plugins**