import { SERVERS } from "~/constants";
import { IndexApi, ISearchConfig, ISearchModel, PartialModel, Stage } from "~/types";
import { getEnv } from "./getEnv/esm/getEnv";
import { MeiliSearchApi, MeiliSearchOptions } from "./MeiliSearchApi";
import { modelConfigApi } from "./model-api/modelConfigApi";

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

  return (stage?: Stage, options: MeiliSearchOptions = {}) => {
    const { adminKey, searchKey, stage: s } = stage ? { ...getEnv(), stage } : getEnv();

    const url = SERVERS[s]?.url;
    const search_key = SERVERS[s]?.search_key || searchKey;
    const admin_key: string | undefined = adminKey || options.admin_key || "";
    return {
      ...state,
      query: MeiliSearchApi<TDoc>(state, { url, search_key, admin_key, ...options }),
      toString() {
        return `Model(${name}[${state.index.pk}])`;
      },
    } as ISearchModel<TDoc>;
  };
};
