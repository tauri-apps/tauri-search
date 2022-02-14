# Typescript API Docs

This section discusses details on how to index the Typescript API Documents and then touches briefly on the documentation generation process.

## Workflow 
> from **Code** to **Search Index**

- >>> **Origination**
  - The `tauri` repo has all of the Typescript code and when a branch is committed it will automatically generate a `ts-docs.json` file based on github actions.
- >>> **Restructuring**
  - This file represents a lightweight AST representation of the code, it has everything we need but
- >>> **Index Modelling**
  - The Typescript API will use the `ts-api` index



## Guiding Principles

1. >>> **Repo Ownership.** Each Repo must have a clear and focused ownership that makes sense to the team but that can also _intuitively_ make sense to the public

    - >>> `tauri` Repo
         ```mermaid
        flowchart TD;
    
        Core((Tauri Repo)) --> RS
        Core --> TS
        RS --> Cargo[Cargo Lib]
        RS --> RsAst[Rust AST]
        RS --future--> RsApi[API Docs]
        TS --> Npm[NPM Module]
        TS --> TsApi[API MD's]
        TS --> TsAst[TS AST]
        ```
      - **Purpose**
        - The `tauri` repo **IS the product**
      - **Consumers**
        - It exposes itself to consumers through the **NPM** and **Crates** packagage manager system
      - **Contributors**
        - It exposes itself to contributors through Github
      - **Downstream**
        - It provides AST assets to `tauri-search`
        - It provides MD assets to `tauri-docs`
  
    - >>> `tauri-docs` Repo
        ```mermaid
        flowchart TD;
        Docs((Tauri Docs)) --> Prose[Prose Markdown]
        Prose --> About
        Prose --> Start[Getting Started]
        Prose --> Guides
        Prose --> Develop
        Docs -.-> TsDocs[[TS API]]
        Docs -. future --> RsDocs[[RS API]]
        About -- refs --> Code[Code Examples]
        Start -- refs --> Code[Code Examples]
        Guides -- refs --> Code[Code Examples]
        Develop -- refs --> Code[Code Examples]
        ```

      - **Purpose**
        - The **Docs** repo is the owner of the website's content
        - It manages all prose content itself
        - It depends on Markdown for API docs
      - **API Docs** 
        - will be provided as Markdown content from `tauri` and integrated into the site
        - Today that will only Typescript content
        - In the future we might bring in Rust content too
      - **Code Examples**
        - The documentation repo will obviously have code examples and the focus of this code will be "using the product" not "building the product"
        - Day 1:
          - code examples can be embedded into markdown using the standard backtick mechanism:
            ```md
            ### Important Section
            Something important ...
             ```ts
            const brilliantExample: (doit: any) => Something<Great> = ...;
             \```
            ```
        - Day 2:
          - real "user code" is written
          - this allows compilation tests as part Docs build process
          - documentation references inline code snippets:
            ```md
            ### Important Section
            Something important ...
            <code-ref lang="ts" file="abc.ts" symbols="getSomething,IGetSomething" />
            ```
            > Note: we may just allowing filtering by **lines** (easiest) to start but **symbols** might prove to be less fragile to future code changes. In general it is a good idea to keep example code files as small as possible to that in many bases you can simply refernce the file with no filters.
            

    - >>> Sitemap for TS API
        ```mermaid
        flowchart TD;

        Base((Base URL)) --> Module[/docs/api/js/modules/NAME/]
        Module --> TypeAlias[#type-aliases]
        TypeAlias --> TA1(#sym_nm)
        TypeAlias --> TA2(#sym_nm)

        Module --> Functions[#functions]
        Functions --> FN1(#sym_nm)
        Functions --> FN2(#sym_nm)

        Module --> Enum[#enumerations]
        Enum --> E1[/MODULE.enum_name/]
        Enum --> E2[/MODULE.enum_name/]

        Module --> Ref[#references]
        Ref --> R1(#sym_nm)
        Ref --> R2(#sym_nm)

        Module --> Int[#interfaces]
        Int --> IF1[//MODULE.int_name/]
        Int --> IF2[//MODULE.int_name/]
        ```


    - >>> `tauri-search` Repo
        ```mermaid
        flowchart TD;

        Search((tauri-search)) --> Indexes[Index and Doc Structure]
        Indexes --> Prose
        Indexes --> API
        Indexes --> Repos

        Search --> SearchBar(Search Bar)

        Search --> Ast[AST Sourcing & Reducing]
        Ast --> Markdown
        Ast --> Typescript
        Ast --> Rust

        Search --> Mapping[AST to URL Mapping]

        Search --> Docs
        ```

        - **Purpose**:
          - to provide a rich search indexes which will be consumed by Tauri website
          - it owns _zero_ content of it's own but rather is responsible for ensuring proper search indexs and search documents are in synchronization with `tauri` (for API docs) and `tauri-docs` (for prose docs)
        - **Devops:**
          - **API ReIndexing:** provide a Netlify build hook which can be called by `tauri` when a new build is released
          - **Prose ReIndexing:** same as above but for `tauri-docs`'s markdown content
          - 
        - **Devops Code:**
          - **API:** _call the MeiliSearch API to ..._
            - update/add indexes
            - update/add documents
            - sanity test on search api
          - **Map:** 
            - map the TS and RS AST's along with Markdown content to URLs (for indexing purposes)
            - RS maps to `docs.rs` for now (in future may map to Tauri)
            - TS maps to TSDoc gen hosted on Tauri
            - Markdown content -- leverage _heading levels_ and directory placement -- will map to URLs on the Tauri site
          - **Configure:**
            - configuration of index(s) in a type-strong manner
        - **Local Search:**
          - provides a Docker service that brings up search engine and scraper (if we end up using it)
          - this provides a safe place to make any code changes to indexing
          - 

2. >>> **Repo Orchestration.** Each repo interacts with the others in as simple manner is as possible to achieve the overall goals.
   - asdfads
3. 
 