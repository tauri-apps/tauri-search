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

export interface MsIndexTasks {
  results: {
    uid: number;
    indexUid: string;
    status: string;
    type: string;
    details: {
      receiveDocuments: number;
      indexedDocuments: number;
    };
    duration: string;
    enqueuedAt: string;
    startedAt: string;
    finishedAt: string;
  }[];
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
