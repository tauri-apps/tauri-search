import { IndexApi, IndexSynonyms, RankingRule, RankingRulesApi } from "~/types";
import { MeiliSearchApi } from "./MeiliSearchApi";
import { rankingRules } from "./model-api/rankingRules";

export type ISearchModel<T extends {}> = {
  name: string;
  type: T;
  index: {
    rules?: RankingRule[];
    displayed?: (keyof T)[];
    searchable?: (keyof T)[];
    filterable?: (keyof T)[];
    distinct?: (keyof T)[];
    sortable?: (keyof T)[];
    stopWords?: string[];
    synonyms?: IndexSynonyms;
  };
  query: ReturnType<typeof MeiliSearchApi>;
  toString(): string;
};

export type PartialModel<T extends {}> = Omit<Partial<ISearchModel<T>>, "index"> & {
  index: Partial<ISearchModel<T>["index"]>;
};

const modelConfigApi = <TDoc extends {}>(update: (s: PartialModel<TDoc>) => void) => {
  const api = <TExclude extends string = never, M extends string = never>(): IndexApi<
    TDoc,
    TExclude
  > =>
    ({
      searchable(...props) {
        if (props?.length > 0) {
          update({ index: { searchable: props } });
        }
        return api<TExclude | "searchable", M>();
      },
      displayed(...props) {
        if (props?.length > 0) {
          update({ index: { displayed: props } });
        }
        return api<TExclude | "displayed", M>();
      },
      distinct(...props) {
        if (props?.length > 0) {
          update({ index: { distinct: props } });
        }
        return api<TExclude | "distinct", M>();
      },
      filterable(...props) {
        if (props?.length > 0) {
          update({ index: { filterable: props } });
        }
        return api<TExclude | "filterable", M>();
      },
      sortable(...props) {
        if (props?.length > 0) {
          update({ index: { sortable: props } });
        }
        return api<TExclude | "searchable", M>();
      },
      stopWords(words) {
        update({ index: { stopWords: words } });
        return api<TExclude | "stopWords">();
      },

      rankingRules(cb: (r: RankingRulesApi) => void) {
        const updateRules = (r: RankingRule[]) => {
          update({ index: { rules: r } });
        };
        const ruleApi = rankingRules(updateRules);
        cb(ruleApi);

        return api<TExclude | "rankingRules">();
      },
    } as IndexApi<TDoc, TExclude>);

  return api();
};

export const createModel = <T extends Record<string, any>>(
  /** the MeiliSearch index name which this model is servicing */
  name: string,
  cb?: (api: IndexApi<T>) => void,
  url: string = "http://localhost:7700"
) => {
  const state: ISearchModel<T> = {
    name,
    type: {} as unknown as T,
    index: {},
    query: MeiliSearchApi(name, { url }),
  };
  const updateState = (s: PartialModel<T>) => {
    if (s.index) {
      state.index = { ...state.index, ...s.index };
    }
  };

  if (cb) {
    cb(modelConfigApi<T>(updateState));
  }

  return {
    ...state,
    toString() {
      return `Model(${name})`;
    },
  } as ISearchModel<T>;
};
