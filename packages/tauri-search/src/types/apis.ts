import { Keys, UnionToTuple } from "inferred-types";
import { Type as MorphType } from "ts-morph";
import { Type } from "~/enums";

export type ModelDefnApi = {
  /**
   * Define the Model's expected field/values for documents brought into the index.
   *
   * **NOTE:** _you do _not_ have to state the `id` property as all documents in Tauri's search
   * solution will use `id` as their primary key_
   */
  document: Record<string, (m: ModelPropsApi) => void>;
  index?: IndexDefnApi;
};

/** represents valid choices for ranking rules */
export type RankingRule =
  | "words"
  | "typo"
  | "proximity"
  | "attribute"
  | "sort"
  | "exactness";

export type T = Record<Keys<UnionToTuple<RankingRule>>, any>;
export type TT<E extends Keys<UnionToTuple<RankingRule>> = never> = Record<
  Keys<UnionToTuple<RankingRule>, E>,
  () => TT
>;

/**
 * An API that allows consumers to set a ranking order for Meilisearch Index.
 * Items chosen become _unavailable_ for further selection ensuring a valid
 * ordering.
 *
 * [Ranking Rules Documentation](https://docs.meilisearch.com/learn/core_concepts/relevancy.html#ranking-rules) */
export type RankingRulesApi<E extends RankingRule = never> = Omit<
  {
    [P in RankingRule]: () => RankingRulesApi<E | P>;
  },
  E
>;

export type Language = "en" | "fr" | "de" | "es" | "jp";

export type StopWords = Record<Language, string[]>;

/**
 * A dictionary of synonyms where the key's value will be made as
 * alias to one or more synonyms.
 */
export type IndexSynonyms = Record<string, string[]>;

export type IndexDefnApi = {
  /**
   * Specify the order for the various _ranking rules_. The default ranking rules are:
   *
   * ```ts
   * ["words", "typo", "proximity", "attribute", "sort", "exactness"]
   * ```
   *
   * Refer to [Ranking Rules Documentation](https://docs.meilisearch.com/learn/core_concepts/relevancy.html#ranking-rules) for more info.
   */
  rankingRules?: (r: RankingRulesApi) => void;
  /**
   * Allows multiple words with the same meaning to be paired together to improve search results.
   *
   * [Synonyms Documentation](https://docs.meilisearch.com/reference/features/synonyms.html#synonyms)
   */
  synonyms?: IndexSynonyms;
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
};

export type DocumentProperty = {
  type: Type;
  literals: string[] | number[];
  flags: string[];
};

export type StringLiteral = {
  type: Type.StringLiteral;
  literals: string[];
  flags: string[];
};
export type NumericLiteral = {
  type: Type.NumericLiteral;
  literals: number[];
  flags: string[];
};

export type StringProp = { type: Type.String; flags: string[] };
export type NumberProp = { type: Type.Number; flags: string[] };
export type BooleanProp = { type: Type.Boolean; flags: string[] };
export type UndefinedProp = { type: Type.Undefined };

export type ModelPropsApi = {
  /**
   * This property will be a _string_ on documents. You may be more
   * explicity by stating literal values if you want to.
   */
  string: <StringLiteral extends string[]>(
    ...literals: StringLiteral
  ) => PropCharacteristicsApi<never>;
  url: () => PropCharacteristicsApi<never>;
  number: <NumericLiteral extends number[]>(
    ...literals: NumericLiteral
  ) => PropCharacteristicsApi<never>;
  boolean: () => PropCharacteristicsApi<never>;
};

export type PropCharacteristicsApi<E extends string> = Omit<
  {
    /**
     * Attributes which should be included in the _displayed_ attribute
     * list. By default, all attributes which are present in a document
     * will be passed through in the API but this can be made explicit.
     */
    displayed: (b?: boolean) => PropCharacteristicsApi<"displayed" | E>;
    /**
     *
     */
    searchable: (b?: boolean) => PropCharacteristicsApi<"searchable" | E>;
    /**
     * Attribute should be used in sorting of
     */
    sortable: (b?: boolean) => PropCharacteristicsApi<"sortable" | E>;
    /**
     *
     */
    distinct: (b?: boolean) => PropCharacteristicsApi<"distinct" | E>;
    /**
     * This attribute can be filtered on in searches
     */
    filterable: (b?: boolean) => PropCharacteristicsApi<"filterable" | E>;
  },
  E
>;
