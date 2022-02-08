import axios, { AxiosRequestConfig } from "axios";
import {
  IMeiliSearchHealth,
  IMeilisearchSearchResponse,
  IMeiliSearchStats,
  IMeilisearchVersion,
  IMeilisearchAddOrReplace,
  IMeilisearchTaskStatus,
  IMeilisearchKey,
  MsIndexStatusResponse,
  IMeilisearchIndexSettings,
  IMeiliSearchQueryApi,
  IMeilisearchAllTasks,
  ISearchConfig,
} from "~/types";

export interface MeiliSearchOptions {
  url?: string;
  search_key?: string;
  admin_key?: string;
}
export type PagingOptions = {
  limit?: number;
  offset?: number;
};

export type ApiOptions = Omit<AxiosRequestConfig, "method">;

export function MeiliSearchApi<TDoc extends {}>(
  model: ISearchConfig<TDoc>,
  searchOptions: MeiliSearchOptions = {}
) {
  const baseURL = searchOptions.url || "http://localhost:7700";
  const idx = model.name;
  // const { adminKey, searchKey } = getEnv();

  const call = async <T>(
    method: "get" | "post" | "put" | "delete",
    url: string,
    options: AxiosRequestConfig = {}
  ): Promise<T> => {
    const fullUrl = `${baseURL}/${url.startsWith("/") ? url.slice(1) : url}`;
    const token = searchOptions.admin_key || searchOptions.search_key || "";
    const headers: Record<string, any> = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };
    if (token && token.length > 0) {
      headers["X-Meili-API-Key"] = token;
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await axios({
      method,
      url: fullUrl,
      ...{
        headers: {
          ...headers,
        },
        ...options,
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

  const endpoints: IMeiliSearchQueryApi<TDoc> = {
    // per index
    createIndex: async () => {
      const task = await post<
        IMeilisearchTaskStatus,
        { uid: string; primaryKey: string }
      >(`indexes`, {
        uid: model.name,
        primaryKey: model.index.pk,
      });

      await endpoints.updateIndexSettings({
        displayedAttributes: model.index.displayed,
        filterableAttributes: model.index.filterable,
        searchableAttributes: model.index.searchable,
        sortableAttributes: model.index.sortable,
        // TODO: need to explore this attribute more
        distinctAttribute: model.index.distinct as any,
        rankingRules: model.index.rules,
        stopWords: model.index.stopWords,
        synonyms: model.index.synonyms,
      });

      return task;
    },
    getIndexTasks: () => get<IMeilisearchAllTasks>(`indexes/${idx}/tasks`),
    getDocument: (docId: string) => get<TDoc>(`indexes/${idx}/documents/${docId}`),
    deleteIndex: (indexName?: string) =>
      del<IMeilisearchTaskStatus>(`indexes/${indexName || idx}`),
    deleteDocument: (docId: string) =>
      del<IMeilisearchTaskStatus>(`indexes/${idx}/documents/${docId}`),
    getDocuments: (o: AxiosRequestConfig = {}) =>
      get<TDoc[]>(`indexes/${idx}/documents`, o),
    deleteAllDocuments: () => del<IMeilisearchTaskStatus>(`indexes/${idx}/documents`),
    addOrReplaceDocuments: (doc: TDoc, o: ApiOptions = {}) =>
      post<IMeilisearchAddOrReplace>(`indexes/${idx}/documents`, JSON.stringify(doc), o),
    addOrUpdateDocuments: (doc: TDoc, o: ApiOptions = {}) =>
      put<IMeilisearchAddOrReplace>(`indexes/${idx}/documents`, JSON.stringify(doc), o),
    search: (text: string, altIndex?: string) =>
      get<IMeilisearchSearchResponse>(`indexes/${altIndex || idx}/search?q=${text}`),
    getIndexSettings: (override?: string) =>
      get<IMeilisearchIndexSettings<TDoc>>(`indexes/${override || idx}/settings`),
    updateIndexSettings: (settings: IMeilisearchIndexSettings<TDoc>) =>
      post<IMeilisearchTaskStatus, IMeilisearchIndexSettings<TDoc>>(
        `indexes/${idx}/settings`,
        settings
      ),
    resetIndexSettings: () => del<IMeilisearchTaskStatus>(`indexes/${idx}/settings`),
    updateRankingRules: () =>
      post<IMeilisearchTaskStatus>(`indexes/${idx}/settings/ranking-rules`),
    updateDistinctAttribute: () =>
      post<IMeilisearchTaskStatus>(`indexes/${idx}/settings/distinct-attribute`),
    updateSearchableAttributes: () =>
      post<IMeilisearchTaskStatus>(`indexes/${idx}/settings/searchable-attributes`),
    updateSortableAttributes: () =>
      post<IMeilisearchTaskStatus>(`indexes/${idx}/settings/sortable-attributes`),
    updateDisplayedAttributes: () =>
      post<IMeilisearchTaskStatus>(`indexes/${idx}/settings/displayed-attributes`),
    updateSynonyms: () =>
      post<IMeilisearchTaskStatus>(`indexes/${idx}/settings/synonyms`),
    updateStopWords: () =>
      post<IMeilisearchTaskStatus>(`indexes/${idx}/settings/stop-words`),

    //  cross-index

    stats: () => get<IMeiliSearchStats>(`stats`),
    health: () => get<IMeiliSearchHealth>(`health`),
    /** all of the indexes which currently exist in MeiliSearch */
    currentIndexes: () => get<MsIndexStatusResponse[]>("indexes"),
    getTask: (id: number) => get<IMeilisearchTaskStatus>(`tasks/${id}`),
    version: () => get<IMeilisearchVersion>(`version`),
    getKeys: () => get<IMeilisearchKey[]>(`keys`),
    createKey: (key: IMeilisearchKey) =>
      post<IMeilisearchTaskStatus>(`keys`, JSON.stringify(key)),
    deleteKey: (key: string) => del<IMeilisearchTaskStatus>(`keys/${key}`),
  };

  return endpoints;
}
