import { SERVERS } from "~/constants";
import {
  IndexApi,
  ISearchConfig,
  ISearchModel,
  RankingRule,
  RankingRulesApi,
  Stage,
} from "~/types";
import { getEnv } from "./getEnv";
import { MeiliSearchApi } from "./MeiliSearchApi";
import { rankingRules } from "./model-api/rankingRules";

export type PartialModel<T extends {}> = Omit<Partial<ISearchModel<T>>, "index"> & {
  index: Partial<ISearchModel<T>["index"]>;
};

const modelConfigApi = <TDoc extends {}>(update: (s: PartialModel<TDoc>) => void) => {
  const api = <TExclude extends string = never, M extends string = never>(): IndexApi<
    TDoc,
    TExclude
  > =>
    ({
      pk(pk: string) {
        update({ index: { pk } });
        return api<TExclude | "pk", M>();
      },
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

      synonyms(synonyms) {
        update({ index: { synonyms } });
        return api<TExclude | "synonyms">();
      },

      rankingRules(cb: (r: RankingRulesApi<TDoc>) => void) {
        const updateRules = (r: RankingRule<TDoc>[]) => {
          update({ index: { rules: r } });
        };
        const ruleApi = rankingRules(updateRules);
        cb(ruleApi);

        return api<TExclude | "rankingRules">();
      },
    } as IndexApi<TDoc, TExclude>);

  return api();
};

export const createModel = <TDoc extends Record<string, any>>(
  /** the MeiliSearch index name which this model is servicing */
  name: string,
  cb?: (api: IndexApi<TDoc>) => void
) => {
  const state: ISearchConfig<TDoc> = {
    name,
    type: {} as unknown as TDoc,
    index: {
      pk: "id",
    },
  };
  const updateState = (s: PartialModel<TDoc>) => {
    if (s.index) {
      state.index = { ...state.index, ...s.index };
    }
  };

  if (cb) {
    cb(modelConfigApi<TDoc>(updateState));
  }

  return (stage?: Stage) => {
    const url = stage ? SERVERS[stage]?.url : SERVERS[getEnv().stage]?.url;
    const search_key = stage
      ? SERVERS[stage]?.search_key
      : SERVERS[getEnv().stage]?.search_key;
    return {
      ...state,
      query: MeiliSearchApi<TDoc>(state, { url, search_key }),
      toString() {
        return `Model(${name}[${state.index.pk}])`;
      },
    } as ISearchModel<TDoc>;
  };
};
