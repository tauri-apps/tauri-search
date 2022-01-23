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

export interface MsCreateIndex {
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
