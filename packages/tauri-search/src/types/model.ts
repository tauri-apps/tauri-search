import { RankingRulesApi } from "~/types/apis";
import { MeiliSearchApi } from "~/utils/MeiliSearchApi";

export type MeiliApi = ReturnType<typeof MeiliSearchApi>;

export type IndexApi<TDoc, TExclude extends string = never> = Omit<
  {
    searchable: (...props: (keyof TDoc)[]) => IndexApi<TDoc, TExclude | "searchable">;
    displayed: (...props: (keyof TDoc)[]) => IndexApi<TDoc, TExclude | "displayed">;
    distinct: (...props: (keyof TDoc)[]) => IndexApi<TDoc, TExclude | "distinct">;
    filterable: (...props: (keyof TDoc)[]) => IndexApi<TDoc, TExclude | "filterable">;
    sortable: (...props: (keyof TDoc)[]) => IndexApi<TDoc, TExclude | "sortable">;
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
      cb: (r: RankingRulesApi) => void
    ) => IndexApi<TDoc, TExclude | "rankingRules">;
  },
  TExclude
>;
