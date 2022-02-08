/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
import { acceptHMRUpdate, defineStore } from "pinia";
import type { UserModule } from "~/types";
import {
  IMeiliSearchHealth,
  IMeilisearchIndex,
  IMeilisearchInterface,
  IMeilisearchSearchResponse,
  IMeiliSearchStats,
  IMeilisearchIndexSettings,
  ConsolidatedModel,
} from "tauri-search";
import { ApiModel } from "tauri-search";
import { SERVERS } from "~/constants";

//#region STORE
export interface SearchState {
  /** is the HTTP server of MeiliSearch reachable */
  health: boolean | "initializing";

  /** the indexes which are defined on MeiliSearch */
  indexes: IMeilisearchInterface[];

  /** indexes to use when searching */
  searchUsing: string[];

  /** database stats for MeiliSearch */
  stats?: IMeiliSearchStats;

  /** index settings */
  indexSettings: Record<string, IMeilisearchIndexSettings<any>>;

  searchStatus: "ready" | "searching" | "error" | "not-ready";

  searchQuery: string;

  searchResults: { id: string; _idx: string; [key: string]: unknown }[];

  prodResults: { id: string; _idx: string; [key: string]: unknown }[];
}

export const useSearch = defineStore("search", {
  state: () =>
    ({
      health: "initializing",
      indexes: [],
      indexSettings: {},
      searchUsing: ["consolidated"],
      stats: undefined,
      searchQuery: "",
      searchStatus: "not-ready",
      searchResults: [],
      prodResults: []
    } as SearchState),
  actions: {
    async search(text: string, force: boolean = false) {
      if (text.trim() === "") {
        this.$state.searchResults = [];
        this.$state.searchQuery = text.trim();
        return;
      }
      if (text.trim() === this.searchQuery.trim() && !force) {
        // no change
        return;
      } else {
        this.searchQuery = text.trim();
      }
      const indexes = this.$state.searchUsing;
      console.group(`searching for: "${text}"`);
      console.info(`search on ${indexes.length} indexes`, indexes);
      console.time("search");
      this.$state.searchStatus = "searching";

      // local search
      const waitFor: Promise<any>[] = [];
      for (const idx of indexes) {
        const addIndex = (
          result: IMeilisearchSearchResponse
        ): IMeilisearchSearchResponse => ({
          ...result,
          hits: result.hits.map((i) => ({ ...i, _idx: idx })),
        });

        waitFor.push(
          get<IMeilisearchSearchResponse, IMeilisearchSearchResponse>(
            api().search(idx, text),
            addIndex
          )
        );
      }
      const results = await Promise.all(waitFor);
      this.$state.searchStatus = "ready";
      console.timeEnd("search");

      const hits = results.flatMap((i) => i.hits);
      console.info(`found ${hits.length} documents`);
      console.groupEnd();
      this.$state.searchResults = hits;

      // prod search
      const waitForProd: Promise<any>[] = [];
      for (const idx of SERVERS.production.indexes) {
        const addIndex = (
          result: IMeilisearchSearchResponse
        ): IMeilisearchSearchResponse => ({
          ...result,
          hits: result.hits.map((i) => ({ ...i, _idx: idx })),
        });

        const model = ConsolidatedModel("production");

        waitForProd.push(
          model.query.search(text, SERVERS.production.indexes[0]).then(r => addIndex(r))
        );
      }

      this.$state.prodResults = await Promise.all(waitForProd);

      return results;
    },
    /** updates settings for all active indexes */
    async updateIndexSettings() {
      for (const idx of this.indexes.map((i) => i.name)) {
        const result = (await ApiModel().query.getIndexSettings(
          idx
        )) as IMeilisearchIndexSettings<any>;

        this.$state.indexSettings = { ...this.$state.indexSettings, [idx]: result };
      }
    },
    toggleUseOfIndex(idx: string) {
      if (this.$state.searchUsing.includes(idx)) {
        this.$state.searchUsing = this.$state.searchUsing.filter((i) => i !== idx);
        this.search(this.searchQuery, true);
        this.updateIndexSettings();
      } else {
        this.$state.searchUsing = [...this.$state.searchUsing, idx];
        this.search(this.searchQuery, true);
        this.updateIndexSettings();
      }
    },
    setUseOfIndexes(indexes: string[]) {
      this.$state.searchUsing = indexes;
      this.search(this.searchQuery, true);
      this.updateIndexSettings();
    },
    statsUpdate(s: IMeiliSearchStats) {
      this.$state.stats = s;
    },
    healthUpdate(h: boolean) {
      this.$state.health = h;
    },
    indexUpdate(idx: IMeilisearchInterface[]) {
      const current = this.$state.indexes.map((i) => i.name);
      const newList = idx.map((i) => i.name);
      if (
        current.length === newList.length &&
        newList.every((i) => current.includes(i))
      ) {
        return;
      }

      this.$state.indexes = idx;
    },
  },
  getters: {
    indexIsUsed: (state) => (idx: string) => state.searchUsing.includes(idx),
    dbSize: (state) => state.stats?.databaseSize || 0,
    indexInfo:
      (state) =>
      (idx: string): IMeilisearchIndex | undefined =>
        state.stats?.indexes[idx],
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSearch, import.meta.hot));
}

//#endregion  STORE

//#region SERVICE
/**
 * Sets up a useful API surface and background
 * checks for certain meta-data which is available
 * as a Pinia store.
 */
export const install: UserModule = ({ isClient }) => {
  if (isClient) {
    const s = useSearch();

    const { pause, resume, isActive } = useIntervalFn(
      async () => {
        s.indexUpdate(await indexes());
        s.statsUpdate(await stats());
      },
      2000,
      { immediate: true }
    );

    // check health of MeiliSearch
    useIntervalFn(
      async () => {
        const h = await health();
        s.healthUpdate(h);
        s.$state.searchStatus = !h ? "not-ready" : "ready";

        if (h === true) {
          s.updateIndexSettings();
          if (!isActive.value) {
            resume();
          }
        }
        if (h === false && isActive.value) pause();
      },
      1000,
      { immediate: true }
    );
  }
};

async function get<T extends {}, U extends {} = never>(url: string, cb?: (r: T) => U) {
  const res = await fetch(url, {headers: { "Access-Control-Allow-Origin" : "*"}});
  if (res.ok) {
    const result = res.json();

    return (
      cb ? (result.then((r) => cb(r)) as Promise<U>) : (result as Promise<T>)
    ) as never extends U ? Promise<T> : Promise<U>;
  } else {
    console.groupCollapsed(`Error with API`);
    console.info(`Request: GET ${url}`);
    console.warn(`Error [${res.status}]: ${res.statusText}`);
    console.groupEnd();
  }
}

async function post<T extends {}, U extends {} = never>(url: string, body: string,  cb?: (r: T) => U) {
  const res = await fetch(url, { method: "post", body, headers: { "Access-Control-Allow-Origin" : "*", "Content-Type": "application/json"}});
  if (res.ok) {
    const result = res.json();

    return (
      cb ? (result.then((r) => cb(r)) as Promise<U>) : (result as Promise<T>)
    ) as never extends U ? Promise<T> : Promise<U>;
  } else {
    console.groupCollapsed(`Error with API`);
    console.info(`Request: GET ${url}`);
    console.warn(`Error [${res.status}]: ${res.statusText}`);
    console.groupEnd();
  }
}

function api(baseUrl: string = "http://localhost:7700") {
  return {
    search: (idx: string, text: string) => `${baseUrl}/indexes/${idx}/search?q=${text}`,
    stats: `${baseUrl}/stats`,
    health: `${baseUrl}/health`,
    indexes: `${baseUrl}/indexes`,
  };
}

async function health(): Promise<boolean> {
  try {
    const response = (await (await fetch(api().health)).json()) as IMeiliSearchHealth;
    return response.status === "available";
  } catch {
    return false;
  }
}

async function indexes() {
  return (await (await fetch(api().indexes)).json()) as IMeilisearchInterface[];
}

async function stats() {
  return (await (await fetch(api().stats)).json()) as IMeiliSearchStats;
}

//#endregion
