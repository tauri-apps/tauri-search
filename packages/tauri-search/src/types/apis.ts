/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
import { Keys } from "inferred-types";
import { Type } from "~/enums";

export type PropertyRank<TDoc extends {}> = `${Keys<TDoc>}:${"asc" | "desc"}`;

/** represents valid choices for ranking rules */
export type RankingRule<TDoc extends {}> =
  | "words"
  | "typo"
  | "proximity"
  | "attribute"
  | "sort"
  | "exactness"
  | PropertyRank<TDoc>;



/**
 * An API that allows consumers to set a ranking order for Meilisearch Index.
 * Items chosen become _unavailable_ for further selection ensuring a valid
 * ordering.
 *
 * [Ranking Rules Documentation](https://docs.meilisearch.com/learn/core_concepts/relevancy.html#ranking-rules) */
export type RankingRulesApi<TDoc extends {}, E extends RankingRule<TDoc> = never> = Omit<
  {
    /**
     * Results are sorted by increasing number of typos. Returns documents that
     * match query terms with fewer typos first.
     */
    typo: () => RankingRulesApi<TDoc, E | "typo">;
    /**
     * Results are sorted by increasing distance between matched query terms. Returns
     * documents where query terms occur close together and in the same order as the
     * query string first.
     */
    proximity: () => RankingRulesApi<TDoc, E | "proximity">;
    /**
     * Results are sorted according to the
     * [attribute ranking order](https://docs.meilisearch.com/learn/core_concepts/relevancy.html#attribute-ranking-order).
     * Returns documents that contain query terms in more important attributes first.
     *
     * Also, note the documents with attributes containing the query words at the beginning
     * of the attribute list will be considered more relevant than documents containing the query
     * words at the end of the attributes.
     */
    attribute: () => RankingRulesApi<TDoc, E | "attribute">;
    /**
     * Results are sorted by the similarity of the matched words with the query words.
     * Returns documents that contain exactly the same terms as the ones queried first.
     */
    exactness: () => RankingRulesApi<TDoc, E | "exactness">;
    /**
     * Results are sorted according to parameters decided at query time. When the sort
     * ranking rule is in a higher position, sorting is exhaustive: results will be less
     * relevant, but follow the user-defined sorting order more closely. When sort is in a
     * lower position, sorting is relevant: results will be very relevant, but might not
     * always follow the order defined by the user.
     */
    sort: () => RankingRulesApi<TDoc, E | "sort">;
    /**
     * Results are sorted by decreasing number of matched query terms. Returns documents
     * that contain all query terms first.
     */
    words: () => RankingRulesApi<TDoc, E | "words">;

    ASC: (prop: keyof TDoc) => RankingRulesApi<TDoc, E>;
    DESC: (prop: keyof TDoc) => RankingRulesApi<TDoc, E>;
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
