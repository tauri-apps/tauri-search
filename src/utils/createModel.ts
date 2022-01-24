import {
  IndexSynonyms,
  MsAddOrReplace,
  MsCreateIndex,
  MsIndexStatsResponse,
  MsIndexStatusResponse,
  MsSearchResponse,
  MsSettingsResponse,
  RankingRule,
  RankingRulesApi,
} from "~/types";
import xxhash from "xxhash-wasm";
import fetch from "node-fetch";
import { getUrl } from "./getUrl";
import { rankingRules } from "./model-api/rankingRules";

export type IndexApi<T, E extends string = never> = Omit<
  {
    searchable: (...props: (keyof T)[]) => IndexApi<T, E | "searchable">;
    displayed: (...props: (keyof T)[]) => IndexApi<T, E | "displayed">;
    distinct: (...props: (keyof T)[]) => IndexApi<T, E | "distinct">;
    filterable: (...props: (keyof T)[]) => IndexApi<T, E | "filterable">;
    sortable: (...props: (keyof T)[]) => IndexApi<T, E | "sortable">;
    /**
     * Because your website might provide content with structured English sentences, we
     * recommend adding stop words. Indeed, the search-engine would not be "spoiled" by
     * linking words and would focus on the main words of the query, rendering more
     * accurate results.
     *
     * Here is the [dedicated page about stop-words](https://docs.meilisearch.com/reference/features/stop_words.html)
     * in the official documentation. You can find more complete lists of
     * English stop-words [like this one](https://gist.github.com/sebleier/554280).
     */
    stopWords: (words: string[]) => IndexApi<T, E | "stopWords">;

    // addMapper: <TInput, TOutput>(
    //   m: Mapper<TInput, TOutput>
    // ) => IndexApi<T, E | typeof m["name"]>;

    /**
     * Specify the order for the various _ranking rules_. The default ranking rules are:
     *
     * ```ts
     * ["words", "typo", "proximity", "attribute", "sort", "exactness"]
     * ```
     *
     * Refer to [Ranking Rules Documentation](https://docs.meilisearch.com/learn/core_concepts/relevancy.html#ranking-rules) for more info.
     */
    rankingRules: (cb: (r: RankingRulesApi) => void) => IndexApi<T, E | "rankingRules">;
  },
  E
>;

const modelConfigApi = <T extends {}>(update: (s: PartialModel<T>) => void) => {
  const api = <E extends string = never, M extends string = never>(): IndexApi<T, E> =>
    ({
      searchable(...props) {
        if (props?.length > 0) {
          update({ info: { searchable: props } });
        }
        return api<E | "searchable", M>();
      },
      displayed(...props) {
        if (props?.length > 0) {
          update({ info: { displayed: props } });
        }
        return api<E | "displayed", M>();
      },
      distinct(...props) {
        if (props?.length > 0) {
          update({ info: { distinct: props } });
        }
        return api<E | "distinct", M>();
      },
      filterable(...props) {
        if (props?.length > 0) {
          update({ info: { filterable: props } });
        }
        return api<E | "filterable", M>();
      },
      sortable(...props) {
        if (props?.length > 0) {
          update({ info: { sortable: props } });
        }
        return api<E | "searchable", M>();
      },
      stopWords(words) {
        update({ info: { stopWords: words } });
        return api<E | "stopWords">();
      },

      rankingRules(cb: (r: RankingRulesApi) => void) {
        const updateRules = (r: RankingRule[]) => {
          update({ info: { rules: r } });
        };
        const ruleApi = rankingRules(updateRules);
        cb(ruleApi);

        return api<E | "rankingRules">();
      },

      // addMapper<TInput extends {}, TOutput extends {}>(
      //   mapper: Mapper<TInput, TOutput>
      // ) {
      //   update({ mappers: })
      //   return api<E | typeof mapper["name"]>
      // },
    } as IndexApi<T, E>);

  return api();
};

export type SearchModel<T extends {}> = {
  name: string;
  hash: number;
  info: {
    type: T;
    rules?: RankingRule[];
    displayed?: (keyof T)[];
    searchable?: (keyof T)[];
    filterable?: (keyof T)[];
    distinct?: (keyof T)[];
    sortable?: (keyof T)[];
    stopWords?: string[];
    synonyms?: IndexSynonyms;
  };
  query: {
    createIndex(): Promise<MsCreateIndex>;
    showIndex(): Promise<MsIndexStatusResponse>;
    showIndexStats(): Promise<MsIndexStatsResponse>;
    addOrReplaceDoc(doc: T): Promise<MsAddOrReplace>;
    search(find: string): Promise<MsSearchResponse<T>>;
    getAllSettings(): Promise<MsSettingsResponse<T>>;
  };
  toString(): string;
};

export type PartialModel<T extends {}> = Omit<Partial<SearchModel<T>>, "info"> & {
  info: Partial<SearchModel<T>["info"]>;
};

export const createModel = async <T extends Record<string, any>>(
  name: string,
  cb?: (api: IndexApi<T>) => void
) => {
  const { h32 } = await xxhash();

  let state: SearchModel<T> = {
    name,
    hash: h32("name"),
    info: {
      type: {} as unknown as T,
    },
    query: {
      createIndex: async () => {
        return (await (
          await fetch(getUrl(`indexes/${name}`), {
            method: "POST",
            body: JSON.stringify({ uid: name, primaryKey: "id" }),
          })
        ).json()) as MsCreateIndex;
      },
      showIndex: async () => {
        return (await (
          await fetch(getUrl(`indexes/${name}`))
        ).json()) as MsIndexStatusResponse;
      },
      showIndexStats: async () => {
        return (await (
          await fetch(getUrl(`indexes/${name}/stats`))
        ).json()) as MsIndexStatsResponse;
      },
      addOrReplaceDoc: async (doc: T) => {
        return (await (
          await fetch(getUrl(`indexes/${name}/documents`), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(doc),
          })
        ).json()) as MsAddOrReplace;
      },
      getAllSettings: async () => {
        return (await (
          await fetch(getUrl(`indexes/${name}`))
        ).json()) as MsSettingsResponse<T>;
      },
      search: async (find: string) => {
        return (await (
          await fetch(getUrl(`indexes/${name}/search?q=${find}`))
        ).json()) as MsSearchResponse<T>;
      },
    },
  };
  const updateState = (s: PartialModel<T>) => {
    if (s.info) {
      state.info = { ...state.info, ...s.info };
      state.hash = h32(JSON.stringify({ ...state.info, name: state.name }));
    }
  };

  if (cb) {
    cb(modelConfigApi<T>(updateState));
  }

  return {
    ...state,
    toString() {
      return `Model(${name}::${state.hash})`;
    },
  } as SearchModel<T>;
};
