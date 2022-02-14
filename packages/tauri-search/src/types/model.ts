import { IndexSynonyms, RankingRule, RankingRulesApi } from "~/types/apis";
import { MeiliSearchApi } from "~/utils/MeiliSearchApi";
import { IMeiliSearchQueryApi } from ".";

export type Stage = "production" | "staging" | "local";

export type MeiliApi = ReturnType<typeof MeiliSearchApi>;

export type Wildcard<T> = (keyof T)[] | ["*"];

export type IndexApi<TDoc, TExclude extends string = never> = Omit<
  {
    /**
     * By default the primary key will be `id` but this can be overridden where it makes sense
     */
    pk: (pk: string) => IndexApi<TDoc, TExclude | "pk">;
    searchable: (...props: Wildcard<TDoc>) => IndexApi<TDoc, TExclude | "searchable">;
    displayed: (...props: Wildcard<TDoc>) => IndexApi<TDoc, TExclude | "displayed">;
    distinct: (...props: Wildcard<TDoc>) => IndexApi<TDoc, TExclude | "distinct">;
    filterable: (...props: Wildcard<TDoc>) => IndexApi<TDoc, TExclude | "filterable">;
    sortable: (...props: Wildcard<TDoc>) => IndexApi<TDoc, TExclude | "sortable">;
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
    stopWords: (words: string[]) => IndexApi<TDoc, TExclude | "stopWords">;

    synonyms: (
      synonyms: Record<string, string[]>
    ) => IndexApi<TDoc, TExclude | "synonyms">;

    /**
     * Specify the order for the various _ranking rules_. The default ranking rules are:
     *
     * ```ts
     * ["words", "typo", "proximity", "attribute", "sort", "exactness"]
     * ```
     *
     * Refer to [Ranking Rules Documentation](https://docs.meilisearch.com/learn/core_concepts/relevancy.html#ranking-rules) for more info.
     */
    rankingRules: (
      cb: (r: RankingRulesApi<TDoc>) => void
    ) => IndexApi<TDoc, TExclude | "rankingRules">;
  },
  TExclude
>;

/**
 * The interface/API surface which a **Model** exposes
 */
export type ISearchModel<TDoc extends {}> = {
  name: string;
  type: TDoc;
  index: {
    pk: string;
    rules?: RankingRule<TDoc>[];
    displayed?: Wildcard<TDoc>;
    searchable?: Wildcard<TDoc>;
    filterable?: Wildcard<TDoc>;
    distinct?: Wildcard<TDoc>;
    sortable?: Wildcard<TDoc>;
    stopWords?: string[];
    synonyms?: IndexSynonyms;
  };
  query: IMeiliSearchQueryApi<TDoc>;
  toString(): string;
};

export type ISearchConfig<TDoc extends {}> = Omit<ISearchModel<TDoc>, "query">;

export type PartialModel<T extends {}> = Omit<Partial<ISearchModel<T>>, "index"> & {
  index: Partial<ISearchModel<T>["index"]>;
};
