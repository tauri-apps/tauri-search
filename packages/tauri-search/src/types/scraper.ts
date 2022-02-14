/**
 * Note: while not all `lvl[x]` fields need to be filled out with a selector
 * if you're using the docs-searchbar then empty values should be set to
 * "null" (aka, the string of null)
 */
export type ScrapeSelector =
  /** the simple representation is just to put a selector in as a string **/
  | string
  | null
  /** but there is an object notation for greater control */
  | {
      selector: string;
      global?: boolean;
      /**
       * will be the displayed value if no content in selector was found.
       */
      default_value?: string;
    };

export type IScrapeSelectorTargets = {
  objectID: string;
  hierarchy_lvl0: ScrapeSelector;
  hierarchy_lvl1: ScrapeSelector;
  hierarchy_lvl2: ScrapeSelector;
  hierarchy_lvl3: ScrapeSelector;
  hierarchy_lvl4: ScrapeSelector;
  hierarchy_lvl5: ScrapeSelector;
  hierarchy_lvl6: ScrapeSelector;
  hierarchy_radio_lvl0: ScrapeSelector;
  hierarchy_radio_lvl1: ScrapeSelector;
  hierarchy_radio_lvl2: ScrapeSelector;
  hierarchy_radio_lvl3: ScrapeSelector;
  hierarchy_radio_lvl4: ScrapeSelector;
  hierarchy_radio_lvl5: ScrapeSelector;
  /** the main body of text */
  content: ScrapeSelector;

  url: string;
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
  /**
   * Sitemaps can contain alternative links for URLs. Those are other versions
   * of the same page, in a different language, or with a different URL. By
   * default docs-scraper will ignore those URLs.
   *
   * Set this to true if you want those other versions to be scraped as well.
   */
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
  selectors: IScrapeSelectorTargets | Record<string, IScrapeSelectorTargets>;
  /**
   * This expects an array of CSS selectors. Any element matching one of those selectors
   * will be removed from the page before any data is extracted from it.
   *
   * This can be used to remove a table of content, a sidebar, or a footer, to make
   * other selectors easier to write.
   */
  selectors_exclude?: string[];

  custom_settings?: {
    /**
     * The synonyms SGG <=> Static Site Generator allows the user to find all the results
     * containing "Static Site Generator" with only typing "SSG" (and the opposite). Here
     * is the [dedicated page about synonyms](https://docs.meilisearch.com/reference/features/synonyms.html)
     * in the official documentation. Also see
     * [Scraper Docs](https://docs.meilisearch.com/reference/features/synonyms.html).
     */
    synonyms?: Record<string, string[]>;

    /**
     * Because your website might provide content with structured English sentences, we
     * recommend adding stop words. Indeed, the search-engine would not be "spoiled" by
     * linking words and would focus on the main words of the query, rendering more
     * accurate results.
     *
     * Here is the [dedicated page about stop-words](https://docs.meilisearch.com/reference/features/stop_words.html)
     * in the official documentation. You can find more complete lists of
     * English stop-words [like this one](https://gist.github.com/sebleier/554280).
     */
    stopWords?: string[];

    /**
     * The default value is 0. By increasing it, you can choose not to index some records
     * if they don't have enough lvlX matching. For example, with a min_indexed_level: 2,
     * the scraper indexes temporary records having at least lvl0, lvl1 and lvl2 set.
     *
     * This is useful when your documentation has pages that share the same lvl0 and lvl1
     * for example. In that case, you don't want to index all the shared records, but want
     * to keep the content different across pages.
     */
    min_indexed_level?: number;
    /**
     * When only_content_level is set to true, then the scraper won't create records for
     * the lvlX selectors.
     *
     * If used, min_indexed_level is ignored.
     */
    only_content_level?: boolean;

    /**
     * When js_render is set to true, the scraper will use ChromeDriver. This is needed for
     * pages that are rendered with JavaScript, for example, pages generated with React, Vue,
     * or applications that are running in development mode: autoreload watch.
     *
     * After installing ChromeDriver, provide the path to the bin using the following environment
     * variable CHROMEDRIVER_PATH (default value is /usr/bin/chromedriver).
     *
     * The default value of js_render is false.
     */
    js_render?: boolean;

    /**
     * This setting specifies the domains that the scraper is allowed to access. In most cases
     * the allowed_domains will be automatically set using the start_urls and stop_urls. When
     * scraping a domain that contains a port, for example http://localhost:8080, the domain
     * needs to be manually added to the configuration.
     */
    allowed_domains?: string[];
  };
}
