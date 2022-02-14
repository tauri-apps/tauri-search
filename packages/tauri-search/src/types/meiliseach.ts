import { AxiosRequestConfig } from "axios";
import { RankingRule, Wildcard } from ".";
import { ApiOptions } from "~/utils/MeiliSearchApi";

export interface MsIndexStatusResponse {
  uid: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  primaryKey: string;
}

export interface IMeilisearchIndexStatsResponse {
  numberOfDocuments: number;
  isIndexing: boolean;
  fieldDistribution: Record<string, any>;
}

export interface IMeilisearchTaskStatus {
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

export interface IMeilisearchAddOrReplace {
  uid: number;
  indexUid: string;
  status: string;
  type: string;
  enqueuedAt: string;
}

export type IMeilisearchSearchHit<T extends {}> = {
  id: string;
} & T;

export interface IMeilisearchSettingsResponse<TDoc extends {}> {
  displayAttributes: (keyof TDoc)[] | ["*"];
  searchableAttributes: (keyof TDoc)[] | ["*"];
  filterAttributes: (keyof TDoc)[] | ["*"];
  sortableAttributes: (keyof TDoc)[] | ["*"];
  rankingRules: RankingRule<TDoc>[];
  stopWords: string[];
  synonyms: Record<string, string[]>;
  distinctAttribute: null | (keyof TDoc)[] | ["*"];
}

export interface IMeilisearchIndexSettings<TDoc extends {}> {
  /** List of associated words treated similarly. A word associated to an array of word as synonyms. */
  synonyms?: Record<string, string[]>;
  /** List of words ignored when present in search queries. */
  stopWords?: string[];
  /**
   * List of ranking rules sorted by order of importance. The order is customizable.
   *
   * The default is: words, typo, proximity, attribute, sort, exactness
   */
  rankingRules?: RankingRule<TDoc>[];
  /** Search returns documents with distinct (different) values of the given field. */
  distinctAttribute?: null | keyof TDoc;
  /** Fields in which to search for matching query words sorted by order of importance. */
  searchableAttributes?: Wildcard<TDoc>;
  /** Fields displayed in the returned documents. */
  displayedAttributes?: Wildcard<TDoc>;
  /**
   * Attributes to use for facetting and filtering. See
   * [Filtering and Faceted Search](https://docs.meilisearch.com/reference/features/filtering_and_faceted_search.html).
   */
  filterableAttributes?: Wildcard<TDoc>;
  /** List of attributes to sort on at search. */
  sortableAttributes?: Wildcard<TDoc>;
}

export interface IMeiliSearchHealth {
  /** the current health status; is "available" when healthy */
  status: string;
}

export type datetime = string;

export interface IMeilisearchInterface {
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

export interface IMeilisearchIndex {
  numberOfDocuments: number;
  isIndexing: false;
  fieldDistribution: Record<string, any>;
}

/**
 * Global MeiliSearch Stats
 */
export interface IMeiliSearchStats {
  databaseSize: number;
  lastUpdate: datetime;
  indexes: Record<string, IMeilisearchIndex>;
}

export type GenericDoc = { id: string; _idx?: string; [key: string]: unknown };

export interface IMeilisearchSearchResponse<T extends {} = GenericDoc> {
  hits: IMeilisearchSearchHit<T>[];
  limit: number;
  nbHits: number;
  offset: number;
  processingTimeMs: number;
  query: string;
}

export interface IMeilisearchIndexTask {
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

export interface IMeilisearchAllTasks {
  results: IMeilisearchIndexTask[];
}

export interface IMeilisearchVersion {
  comitSha: string;
  commitDate: string;
  /** semver represented as string */
  pkgVersion: string;
}

export interface IMeilisearchKey {
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

export interface IMeiliSearchQueryApi<TDoc extends {}> {
  /**
   * Creates an index for the given model.
   *
   * Note: the primary key will be set to whatever is in your Model
   * which will be `id` unless stated otherwise.
   */
  createIndex: () => Promise<IMeilisearchTaskStatus>;
  getIndexTasks: () => Promise<IMeilisearchAllTasks>;
  getDocument: (docId: string) => Promise<TDoc>;
  deleteDocument: (docId: string) => Promise<IMeilisearchTaskStatus>;
  getDocuments: (o?: AxiosRequestConfig) => Promise<TDoc[]>;
  deleteAllDocuments: () => Promise<IMeilisearchTaskStatus>;
  /**
   * Delete's an index on MeiliSeach (including all docs).
   *
   * If no index name is
   * given then it will delete the index associated with this model but you can
   * override that to whatever you like.
   */
  deleteIndex: (idx?: string) => Promise<IMeilisearchTaskStatus>;
  addOrReplaceDocuments: (doc: TDoc, o?: ApiOptions) => Promise<IMeilisearchAddOrReplace>;
  addOrUpdateDocuments: (doc: TDoc, o?: ApiOptions) => Promise<IMeilisearchAddOrReplace>;

  search: (text: string, altIndex?: string) => Promise<IMeilisearchSearchResponse>;

  getIndexSettings: (override?: string) => Promise<IMeilisearchIndexSettings<TDoc>>;
  updateIndexSettings: (
    settings: IMeilisearchIndexSettings<TDoc>
  ) => Promise<IMeilisearchTaskStatus>;

  resetIndexSettings: () => Promise<IMeilisearchTaskStatus>;
  updateRankingRules: () => Promise<IMeilisearchTaskStatus>;
  updateDistinctAttribute: () => Promise<IMeilisearchTaskStatus>;
  updateSearchableAttributes: () => Promise<IMeilisearchTaskStatus>;
  updateSortableAttributes: () => Promise<IMeilisearchTaskStatus>;
  updateDisplayedAttributes: () => Promise<IMeilisearchTaskStatus>;
  updateSynonyms: () => Promise<IMeilisearchTaskStatus>;
  updateStopWords: () => Promise<IMeilisearchTaskStatus>;

  //  cross-index

  stats: () => Promise<IMeiliSearchStats>;
  health: () => Promise<IMeiliSearchHealth>;
  /** all of the indexes which currently exist in MeiliSearch */
  currentIndexes: () => Promise<MsIndexStatusResponse[]>;
  version: () => Promise<IMeilisearchVersion>;
  getKeys: () => Promise<IMeilisearchKey[]>;
  getTask: (id: number) => Promise<IMeilisearchTaskStatus>;
  createKey: (key: IMeilisearchKey) => Promise<IMeilisearchTaskStatus>;
  deleteKey: (key: string) => Promise<IMeilisearchTaskStatus>;
}
