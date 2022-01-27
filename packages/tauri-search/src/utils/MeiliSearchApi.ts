import axios, { AxiosRequestConfig } from "axios";
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
  const baseUrl = options.url || "http://localhost:7700";
  const fetch = axios.create({
    baseURL: "baseURL",
    timeout: 1000,
    headers: {},
  });

  const call = async <T>(
    method: "get" | "post" | "put" | "delete",
    url: string,
    options: AxiosRequestConfig = {}
  ): Promise<T> => {
    const res = await fetch[method]<T>(url, options);
    return res.data;
  };

  const get = <T>(url: string, options: AxiosRequestConfig = {}) => {
    return call("get", `${baseUrl}/${url.startsWith("/" ? url.slice(1) : url)}`, options);
  };
  const put = <T>(
    url: string,
    data?: AxiosRequestConfig["data"],
    options: AxiosRequestConfig = {}
  ) => {
    return call<T>("put", `${baseUrl}/${url.startsWith("/" ? url.slice(1) : url)}`, {
      ...options,
      data,
    });
  };
  const post = async <T>(
    url: string,
    data?: AxiosRequestConfig["data"],
    options: AxiosRequestConfig = {}
  ): Promise<T> => {
    return call<T>("post", `${baseUrl}/${url.startsWith("/" ? url.slice(1) : url)}`, {
      ...options,
      data,
    });
  };
  const del = <T>(url: string, options: AxiosRequestConfig = {}) => {
    return call<T>(
      "delete",
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
    getDocuments: (o: AxiosRequestConfig = {}) => get<TDoc[]>(`indexes/${idx}/documents`, o),
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
