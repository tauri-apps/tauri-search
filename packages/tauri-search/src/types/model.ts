import { Mapper } from "~/utils/createMapper";
import { meiliApi } from "~/utils/model-api/meiliApi";
import { IndexSynonyms, RankingRule, RankingRulesApi } from ".";
import { ModelMapper } from "./mapping";

/**
 * this represents the primary surface area for _configuring_ a search model
 */
export type SearchModelConfig<
  TDoc extends {},
  TMap extends MapperDictionary<string, any, TDoc> = never,
  TExclude extends string = never
> = Omit<
  {
    searchable: (
      ...props: (keyof TDoc)[]
    ) => SearchModelConfig<TDoc, TMap, TExclude | "searchable">;
    displayed: (
      ...props: (keyof TDoc)[]
    ) => SearchModelConfig<TDoc, TMap, TExclude | "displayed">;
    distinct: (
      ...props: (keyof TDoc)[]
    ) => SearchModelConfig<TDoc, TMap, TExclude | "distinct">;
    filterable: (
      ...props: (keyof TDoc)[]
    ) => SearchModelConfig<TDoc, TMap, TExclude | "filterable">;
    sortable: (
      ...props: (keyof TDoc)[]
    ) => SearchModelConfig<TDoc, TMap, TExclude | "sortable">;
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
    stopWords: (words: string[]) => SearchModelConfig<TDoc, TMap, TExclude | "stopWords">;

    // addMapper: <TInput, TOutput>(
    //   m: Mapper<TInput, TOutput>
    // ) => IndexApi<T, E | typeof m["name"]>;

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
    ) => SearchModelConfig<TDoc, TMap, TExclude | "rankingRules">;

    addMapper: <N extends string>(
      name: N
    ) => {
      mapDefn: <PInput>(
        mapper: ModelMapper<PInput, TDoc>
      ) => SearchModelConfig<TDoc, TMap & Record<N, ModelMapper<PInput, TDoc>>, TExclude>;
    };
  },
  TExclude
>;

/**
 * Provides shape of the Index configuration in _state_
 */
export type SearchIndexConfig<TDoc extends {}> = {
  hash?: number;
  rules?: RankingRule[];
  displayed?: (keyof TDoc)[];
  searchable?: (keyof TDoc)[];
  filterable?: (keyof TDoc)[];
  distinct?: (keyof TDoc)[];
  sortable?: (keyof TDoc)[];
  stopWords?: string[];
  synonyms?: IndexSynonyms;
};

/**
 * The **MapperDictionary** is a dictionary who's _keys_ represent each mapper that
 * the consumer of this API has configured.
 *
 * The _values_ in the dictionary are of type
 * `Mapper<I,O>` where the output format will be statically set to the `TDoc` property
 * during configuration.
 */
export type MapperDictionary<K extends string, I extends {}, O extends {}> = Record<
  K,
  Mapper<I, O>
>;

/**
 * An encapsulation of the "state" which a model is managing.
 */
export type SearchModelState<
  /** document structure */
  TDoc extends {},
  /** mapper configuration */
  TMap extends MapperDictionary<string, any, TDoc> | never = never,
  TExclude extends string = never
> = {
  /** the name of the model */
  name: Readonly<string>;
  /**
   * the TS type of the document being managed by this Model
   * ```ts
   * type Doc = typeof state.type;
   * ```
   */
  type: TDoc;
  /**
   * The index configuration which this Model is managing
   */
  index: SearchIndexConfig<TDoc>;
  /**
   * A dictionary of mapping function which convert an expected data structure to
   * this Model's document structure.
   */
  mappers: TMap;
};

export type MeiliApi = ReturnType<typeof meiliApi>;
