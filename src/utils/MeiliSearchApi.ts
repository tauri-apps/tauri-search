import { env } from "process";
import fetch, { RequestInit } from "node-fetch";
import {
  MeiliSearchHealth,
  MeiliSearchIndex,
  MeiliSearchResponse,
  MeiliSearchStats,
  MsVersion,
  MsAddOrReplace,
  MsIndexTasks,
  MsSettingsResponse,
  MsTaskStatus,
  MsKey,
} from "~/types";
import { slice } from "cheerio/lib/api/traversing";

export interface MeiliSearchOptions {
  url?: string;
}
export type PagingOptions = {
  limit?: number;
  offset?: number;
};

export type ApiOptions = Omit<RequestInit, "method">;

export function MeiliSearchApi<TDoc extends {}>(
  idx: string,
  options: MeiliSearchOptions = {}
) {
  const baseUrl = options.url || env.URL || "http://localhost:7700";

  const call = async <T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    options: ApiOptions = {}
  ): Promise<T> => {
    const res = await fetch(url, { ...options, method });
    if (res.ok) {
      return res.json() as Promise<T>;
    } else {
      throw new Error(
        `Problem calling the MeiliSearch API at the path of: ${method} ${url}. Status message was "${res.statusText}" [${res.status}]`
      );
    }
  };

  const get = <T>(url: string, options: ApiOptions = {}) => {
    return call("GET", `${baseUrl}/${url.startsWith("/" ? url.slice(1) : url)}`, options);
  };
  const put = <T>(
    url: string,
    body?: ApiOptions["body"],
    options: Omit<ApiOptions, "body"> = {}
  ) => {
    return call<T>("PUT", `${baseUrl}/${url.startsWith("/" ? url.slice(1) : url)}`, {
      ...options,
      body,
    });
  };
  const post = async <T>(
    url: string,
    body?: ApiOptions["body"],
    options: Omit<ApiOptions, "body"> = {}
  ): Promise<T> => {
    return call<T>("POST", `${baseUrl}/${url.startsWith("/" ? url.slice(1) : url)}`, {
      ...options,
      body,
    });
  };
  const del = <T>(url: string, options: ApiOptions = {}) => {
    return call<T>(
      "DELETE",
      `${baseUrl}/${url.startsWith("/" ? url.slice(1) : url)}`,
      options
    );
  };

  const endpoints = {
    // per index
    getIndexTasks: get<MsIndexTasks>(`indexes/${idx}/tasks`),
    getDocument: (docId: string) => get<TDoc>(`indexes/${idx}/documents/${docId}`),
    deleteDocument: (docId: string) =>
      del<MsTaskStatus>(`indexes/${idx}/documents/${docId}`),
    getDocuments: (paging: PagingOptions = {}) => get<TDoc[]>(`indexes/${idx}/documents`),
    deleteAllDocuments: del<MsTaskStatus>(`indexes/${idx}/documents`),
    addOrReplaceDocuments: (doc: TDoc, o: ApiOptions = {}) =>
      post<MsAddOrReplace>(`indexes/${idx}/documents`, JSON.stringify(doc), o),
    addOrUpdateDocuments: (doc: TDoc, o: ApiOptions = {}) =>
      put<MsAddOrReplace>(`indexes/${idx}/documents`, JSON.stringify(doc), o),
    search: (text: string) => get<MeiliSearchResponse>(`indexes/${idx}/search?q=${text}`),
    getAllIndexSettings: get<MsSettingsResponse<TDoc>>(`indexes/${idx}/settings`),
    updateIndexSettings: (settings: MsSettingsResponse<TDoc>) =>
      post<MsTaskStatus>(`indexes/${idx}/settings`, JSON.stringify(settings)),
    resetIndexSettings: del<MsTaskStatus>(`indexes/${idx}/settings`),
    updateRankingRules: post<MsTaskStatus>(`indexes/${idx}/settings/ranking-rules`),
    updateDistinctAttribute: post<MsTaskStatus>(
      `indexes/${idx}/settings/distinct-attribute`
    ),
    updateSearchableAttributes: post<MsTaskStatus>(
      `indexes/${idx}/settings/searchable-attributes`
    ),
    updateSortableAttributes: post<MsTaskStatus>(
      `indexes/${idx}/settings/sortable-attributes`
    ),
    updateDisplayedAttributes: post<MsTaskStatus>(
      `indexes/${idx}/settings/displayed-attributes`
    ),
    updateSynonyms: post<MsTaskStatus>(`indexes/${idx}/settings/synonyms`),
    updateStopWords: post<MsTaskStatus>(`indexes/${idx}/settings/stop-words`),

    //  cross-index

    stats: get<MeiliSearchStats>(`stats`),
    health: get<MeiliSearchHealth>(`health`),
    indexes: get<MeiliSearchIndex>(`indexes`),
    version: get<MsVersion>(`version`),
    getKeys: get<MsKey[]>(`keys`),
    createKey: (key: MsKey) => post<MsTaskStatus>(`keys`, JSON.stringify(key)),
    deleteKey: (key: string) => del<MsTaskStatus>(`keys/${key}`),
  };

  return { get, put, post, delete: del, endpoints };
}
