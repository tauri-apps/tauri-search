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

export type GenericDoc = {id: string; _idx?: string; [key:string]: unknown};


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
export type WithIndex<T extends MeiliSearchResponse> =
  Omit<T, "hits"> & { hits:
    {
      [K in keyof T["hits"]]: T["hits"][K] & Record<K, {_idx: string}>
    }[number];
  };

