import axios, { AxiosRequestConfig } from "axios";
import {
  MeiliSearchHealth,
  MeiliSearchResponse,
  MeiliSearchStats,
  MsVersion,
  MsAddOrReplace,
  MsSettingsResponse,
  MsTaskStatus,
  MsKey,
  MsIndexStatusResponse,
  MsSettingsUpdate,
  MeiliSearchQueryApi,
  ISearchConfig,
  MsAllTasks,
} from "~/types";

export interface MeiliSearchOptions {
  url?: string;
}
export type PagingOptions = {
  limit?: number;
  offset?: number;
};

export type ApiOptions = Omit<AxiosRequestConfig, "method">;

export function MeiliSearchApi<TDoc extends {}>(
  model: ISearchConfig<TDoc>,
  options: MeiliSearchOptions = {}
) {
  const baseURL = options.url || "http://localhost:7700";
  const idx = model.name;

  const call = async <T>(
    method: "get" | "post" | "put" | "delete",
    url: string,
    options: AxiosRequestConfig = {}
  ): Promise<T> => {
    const fullUrl = `${baseURL}/${url.startsWith("/") ? url.slice(1) : url}`;

    const res = await axios({
      method,
      url: fullUrl,
      ...{
        ...options,
        headers: {
          "Content-Type": options.data ? "application/json" : "application/text",
        },
      },
    }).catch((err) => {
      if (axios.isAxiosError(err)) {
        // request was made but server responded with non-200 response
        if (err.response) {
          switch (err.response.status) {
            case 401:
              throw new Error(
                `Unauthorized to use MeiliSearch endpoint [${method.toUpperCase()} /${url}]!`
              );
            case 404:
              throw new Error(
                `Couldn't find MeiliSearch endpoint [${method.toUpperCase()} /${url}]!`
              );

            case 415:
              throw new Error(
                `\nUnsupported media type received by MeiliSearch endpoint [${method.toUpperCase()} /${url}]!\n  - message: ${
                  err.response.data?.message
                }\n  - headers: ${JSON.stringify(err.response.headers, null, 2)}\n\n`
              );

            case 429:
              throw new Error(
                `You are being rate limited on the MeiliSearch API [${method.toUpperCase()} /${url}]`
              );

            default:
              throw new Error(
                `Unexpected Error [${
                  err.response.status
                }] returned from MeiliSearch server [${method.toUpperCase()} /${url}]: [${
                  err.response.status
                }] ${err.response.statusText}`
              );
          }
        } else {
          throw err;
        }
      }
    });
    return res?.data;
  };

  const get = <T>(url: string, options: AxiosRequestConfig = {}) => {
    return call<T>("get", url, options);
  };
  const put = <T, U extends any = string>(
    url: string,
    data?: string | U,
    options: AxiosRequestConfig = {}
  ) => {
    return call<T>("put", url, {
      ...options,
      data,
    });
  };
  const post = async <T, U extends any = string>(
    url: string,
    data?: string | U,
    options: AxiosRequestConfig = {}
  ): Promise<T> => {
    return call<T>("post", url, {
      ...options,
      data,
    });
  };
  const del = <T>(url: string, options: AxiosRequestConfig = {}) => {
    return call<T>("delete", url, options);
  };

  const endpoints: MeiliSearchQueryApi<TDoc> = {
    // per index
    createIndex: () =>
      post<MsTaskStatus, { uid: string; primaryKey: string }>(`indexes`, {
        uid: model.name,
        primaryKey: model.index.pk,
      }),
    getIndexTasks: () => get<MsAllTasks>(`indexes/${idx}/tasks`),
    getDocument: (docId: string) => get<TDoc>(`indexes/${idx}/documents/${docId}`),
    deleteIndex: (indexName?: string) => del<MsTaskStatus>(`indexes/${indexName || idx}`),
    deleteDocument: (docId: string) =>
      del<MsTaskStatus>(`indexes/${idx}/documents/${docId}`),
    getDocuments: (o: AxiosRequestConfig = {}) =>
      get<TDoc[]>(`indexes/${idx}/documents`, o),
    deleteAllDocuments: () => del<MsTaskStatus>(`indexes/${idx}/documents`),
    addOrReplaceDocuments: (doc: TDoc, o: ApiOptions = {}) =>
      post<MsAddOrReplace>(`indexes/${idx}/documents`, JSON.stringify(doc), o),
    addOrUpdateDocuments: (doc: TDoc, o: ApiOptions = {}) =>
      put<MsAddOrReplace>(`indexes/${idx}/documents`, JSON.stringify(doc), o),
    search: (text: string) => get<MeiliSearchResponse>(`indexes/${idx}/search?q=${text}`),
    getAllIndexSettings: () => get<MsSettingsResponse<TDoc>>(`indexes/${idx}/settings`),
    updateIndexSettings: (settings: MsSettingsUpdate<TDoc>) =>
      post<MsTaskStatus, MsSettingsUpdate<TDoc>>(`indexes/${idx}/settings`, settings),
    resetIndexSettings: () => del<MsTaskStatus>(`indexes/${idx}/settings`),
    updateRankingRules: () => post<MsTaskStatus>(`indexes/${idx}/settings/ranking-rules`),
    updateDistinctAttribute: () =>
      post<MsTaskStatus>(`indexes/${idx}/settings/distinct-attribute`),
    updateSearchableAttributes: () =>
      post<MsTaskStatus>(`indexes/${idx}/settings/searchable-attributes`),
    updateSortableAttributes: () =>
      post<MsTaskStatus>(`indexes/${idx}/settings/sortable-attributes`),
    updateDisplayedAttributes: () =>
      post<MsTaskStatus>(`indexes/${idx}/settings/displayed-attributes`),
    updateSynonyms: () => post<MsTaskStatus>(`indexes/${idx}/settings/synonyms`),
    updateStopWords: () => post<MsTaskStatus>(`indexes/${idx}/settings/stop-words`),

    //  cross-index

    stats: () => get<MeiliSearchStats>(`stats`),
    health: () => get<MeiliSearchHealth>(`health`),
    /** all of the indexes which currently exist in MeiliSearch */
    currentIndexes: () => get<MsIndexStatusResponse[]>("indexes"),
    getTask: (id: number) => get<MsTaskStatus>(`tasks/${id}`),
    version: () => get<MsVersion>(`version`),
    getKeys: () => get<MsKey[]>(`keys`),
    createKey: (key: MsKey) => post<MsTaskStatus>(`keys`, JSON.stringify(key)),
    deleteKey: (key: string) => del<MsTaskStatus>(`keys/${key}`),
  };

  return endpoints;
}
