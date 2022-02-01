import { AxiosRequestConfig } from "axios";
import { ApiOptions } from "~/utils/MeiliSearchApi";
import { RankingRule } from ".";

export interface MsIndexStatusResponse {
  uid: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  primaryKey: string;
}

export interface MsIndexStatsResponse {
  numberOfDocuments: number;
  isIndexing: boolean;
  fieldDistribution: Record<string, any>;
}

export interface MsTaskStatus {
  uid: number;
  indexUid: string;
  status: string;
  type: string;
  error?: {
    message: string;
    link?: string;
    type: string;
    code: string;
  };
  enqueuedAt: string;
}

export interface MsAddOrReplace {
  uid: number;
  indexUid: string;
  status: string;
  type: string;
  enqueuedAt: string;
}

export type MsSearchHit<T extends {}> = {
  id: string;
} & T;

export interface MsSearchResponse<T extends {}> {
  hits: MsSearchHit<T>[];
}

export interface MsSettingsResponse<T extends {}> {
  displayAttributes: (keyof T)[] | ["*"];
  searchableAttributes: (keyof T)[] | ["*"];
  filterAttributes: (keyof T)[] | ["*"];
  sortableAttributes: (keyof T)[] | ["*"];
  rankingRules: RankingRule[];
  stopWords: string[];
  synonyms: Record<string, string[]>;
  distinctAttribute: null | (keyof T)[] | ["*"];
}

export interface IMeilisearchIndexSettings<T extends {}> {
  /** List of associated words treated similarly. A word associated to an array of word as synonyms. */
  synonyms?: Record<string, string[]>;
  /** List of words ignored when present in search queries. */
  stopWords?: string[];
  /**
   * List of ranking rules sorted by order of importance. The order is customizable.
   *
   * The default is: words, typo, proximity, attribute, sort, exactness
   */
  rankingRules?: RankingRule[];
  /** Search returns documents with distinct (different) values of the given field. */
  distinctAttribute?: null | keyof T;
  /** Fields in which to search for matching query words sorted by order of importance. */
  searchableAttributes?: (keyof T)[];
  /** Fields displayed in the returned documents. */
  displayedAttributes?: (keyof T)[];
  /**
   * Attributes to use for facetting and filtering. See
   * [Filtering and Faceted Search](https://docs.meilisearch.com/reference/features/filtering_and_faceted_search.html).
   */
  filterableAttributes?: (keyof T)[];
  /** List of attributes to sort on at search. */
  sortableAttributes?: (keyof T)[];
}

export interface MeiliSearchHealth {
  /** the current health status; is "available" when healthy */
  status: string;
}

export type datetime = string;

export interface MeiliSearchInterface {
  uid: string;
  name: string;
  /** datetime string (aka., 2022-01-23T22:47:42.745395044Z) */
  createdAt: datetime;
  /** datetime string (aka., 2022-01-23T22:47:42.745395044Z) */
  updatedAt: datetime;
  /**
   * the property serving as the primary key for the index,
   * use `id` unless there's a good reason not to
   */
  primaryKey: string;
}

export interface MeiliSearchIndex {
  numberOfDocuments: number;
  isIndexing: false;
  fieldDistribution: Record<string, any>;
}

/**
 * Global MeiliSearch Stats
 */
export interface MeiliSearchStats {
  databaseSize: number;
  lastUpdate: datetime;
  indexes: Record<string, MeiliSearchIndex>;
}

export type GenericDoc = { id: string; _idx?: string; [key: string]: unknown };

export interface MeiliSearchResponse<T extends {} = GenericDoc> {
  hits: T[];
  limit: number;
  nbHits: number;
  offset: number;
  processingTimeMs: number;
  query: string;
}

/**
 * The search results but _with_ the index used inserted on
 * each "hit"
 */
export type WithIndex<T extends MeiliSearchResponse> = Omit<T, "hits"> & {
  hits: {
    [K in keyof T["hits"]]: T["hits"][K] & Record<K, { _idx: string }>;
  }[number];
};

export interface MsIndexTask {
  uid: number;
  indexUid: string;
  status: string;
  type: string;
  details: {
    receiveDocuments: number;
    indexedDocuments: number;
  };
  error?: {
    message: string;
    link?: string;
    type: string;
    code: string;
  };
  duration: string;
  enqueuedAt: string;
  startedAt: string;
  finishedAt: string;
}

export interface MsAllTasks {
  results: MsIndexTask[];
}

export interface MsVersion {
  comitSha: string;
  commitDate: string;
  /** semver represented as string */
  pkgVersion: string;
}

export interface MsKey {
  description?: string;
  /**
   * What actions are allowed based on this key
   * ```ts
   * actions: ["documents.add", "documents.delete"]
   * ```
   */
  actions: string[];
  /**
   * The indexes which will give the actions permissions
   */
  indexes: string[];

  /** todo: check that this can be a number, it CAN be a null value */
  expiresAt: number | null;
}

export interface MeiliSearchQueryApi<TDoc extends {}> {
  /**
   * Creates an index for the given model.
   *
   * Note: the primary key will be set to whatever is in your Model
   * which will be `id` unless stated otherwise.
   */
  createIndex: () => Promise<MsTaskStatus>;
  getIndexTasks: () => Promise<MsAllTasks>;
  getDocument: (docId: string) => Promise<TDoc>;
  deleteDocument: (docId: string) => Promise<MsTaskStatus>;
  getDocuments: (o?: AxiosRequestConfig) => Promise<TDoc[]>;
  deleteAllDocuments: () => Promise<MsTaskStatus>;
  /**
   * Delete's an index on MeiliSeach (including all docs).
   *
   * If no index name is
   * given then it will delete the index associated with this model but you can
   * override that to whatever you like.
   */
  deleteIndex: (idx?: string) => Promise<MsTaskStatus>;
  addOrReplaceDocuments: (doc: TDoc, o?: ApiOptions) => Promise<MsAddOrReplace>;
  addOrUpdateDocuments: (doc: TDoc, o?: ApiOptions) => Promise<MsAddOrReplace>;

  search: (text: string) => Promise<MeiliSearchResponse>;

  getAllIndexSettings: () => Promise<MsSettingsResponse<TDoc>>;
  updateIndexSettings: (
    settings: IMeilisearchIndexSettings<TDoc>
  ) => Promise<MsTaskStatus>;

  resetIndexSettings: () => Promise<MsTaskStatus>;
  updateRankingRules: () => Promise<MsTaskStatus>;
  updateDistinctAttribute: () => Promise<MsTaskStatus>;
  updateSearchableAttributes: () => Promise<MsTaskStatus>;
  updateSortableAttributes: () => Promise<MsTaskStatus>;
  updateDisplayedAttributes: () => Promise<MsTaskStatus>;
  updateSynonyms: () => Promise<MsTaskStatus>;
  updateStopWords: () => Promise<MsTaskStatus>;

  //  cross-index

  stats: () => Promise<MeiliSearchStats>;
  health: () => Promise<MeiliSearchHealth>;
  /** all of the indexes which currently exist in MeiliSearch */
  currentIndexes: () => Promise<MsIndexStatusResponse[]>;
  version: () => Promise<MsVersion>;
  getKeys: () => Promise<MsKey[]>;
  getTask: (id: number) => Promise<MsTaskStatus>;
  createKey: (key: MsKey) => Promise<MsTaskStatus>;
  deleteKey: (key: string) => Promise<MsTaskStatus>;
}
