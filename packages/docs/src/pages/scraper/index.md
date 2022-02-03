# MeiliSearch Scraper

The two primary means of getting documents into your search indexes are:

1. **Structured Data** - using the API to send in structured data, or 
2. **Un/Semi-Structured Data** - use a "scraper tool" to grab the content off live sites

In this latter option, we have the [**MeiliSearch Scraper**](https://github.com/meilisearch/docs-scraper) which they strongly suggest over building your own. In this repo's Docker compose file we start up both a search server and the scraper.

## Configuration

- >>> The configuration file structurally looks like this:
  ```ts
    export type ScrapeSelector =
    /** the simple representation is just to put a selector in as a string **/
    | string
    /** but there is an object notation for greater control */
    | {
        selector: string;
        global: boolean;
        /**
        * will be the displayed value if no content in selector was found.
        */
        default_value: string;
        };

    export type ScrapeSelectorTargets = {
    lvl0: ScrapeSelector;
    lvl1: ScrapeSelector;
    lvl2: ScrapeSelector;
    lvl3: ScrapeSelector;
    lvl4: ScrapeSelector;
    lvl5: ScrapeSelector;
    lvl6: ScrapeSelector;
    /** the main body of text */
    text: ScrapeSelector;
    };

    export type ScrapeUrls =
    | string
    | {
        url: string;
        selectors_key: string;
        };

    export interface MeiliSearchConfig {
    /**
    * The index_uid field is the index identifier in your MeiliSearch instance
    * in which your website content is stored. The scraping tool will create a
    * new index if it does not exist.
    */
    index_uid: string;
    /** allows the scraper to index pages by following links */
    start_urls: ScrapeUrls[];
    sitemap_alternate_links: ScrapeUrls[];
    /** allows the scraper to index using the sitemap XML */
    sitemap_urls: string[];
    /** The scraper will not follow links that match stop_urls. **/
    stop_urls: string[];
    /**
    * DOM selector references which bracket the relevant sections.
    *
    * **Note:** `lvl0` is highest priority and `lvl6` lowest
    *
    * **Note:** the object notation allows you to have different selectors between
    * different pages (`default` is the fallback). To use this format you must also add
    * `selectors_key` props to the start_urls
    */
    selectors: ScrapeSelectorTargets | Record<string, ScrapeSelectorTargets>;
    }  
  ```
  > **Note:** always refer to the actual Typescript definition defined in `tauri-search` as
  this is kept up-to-date and has many additional optional parameters.
- The main ambition is to match a DOM element to a document's "tag properties" (for lvl0-6) and then use the `text` selector for the full body of text.
- +++ The scraper can handle authentication if that's needed (but we should not need it)
  - [document link](https://github.com/meilisearch/docs-scraper#authentication)
  - ENV variables include:
    - `DOCS_SCRAPER_BASICAUTH_USERNAME`
    - `DOCS_SCRAPER_BASICAUTH_PASSWORD`
    - `IAP_AUTH_CLIENT_ID`
    - `IAP_AUTH_SERVICE_ACCOUNT_JSON`
  - _and for keycloak access_
    - `KC_URL`
    - `KC_REALM`
    - `KC_CLIENT_ID`
    - `KC_CLIENT_SECRET`
- If you're scraping sites which are rendered with Javascript you will need to [install Chrome Headless](https://github.com/meilisearch/docs-scraper#installing-chrome-headless).

## API Submission

If you're using the scraper, it will use the API without you're needing to be involved but if you have 
