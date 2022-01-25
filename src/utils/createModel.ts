import {
  MapperDictionary,
  SearchModelState,
  SearchModel,
  SearchModelConfig,
} from "~/types";

import { meiliApi } from "./model-api/meiliApi";
import { mappingApi } from "./model-api/mappingApi";
import { modelConfigApi } from "./model-api/modelConfig";

const finalize =
  (name: string, initial: ) =>
  <TDoc extends {}, TMap extends MapperDictionary<string, any, TDoc>>(
    state: SearchModelState<TDoc, TMap>
  ) => {
    return {
      ...state,
      api: meiliApi<TDoc>(state.name),
      ...mappingApi<TDoc, TMap>(name, state.mappers),
    } as SearchModel<TDoc, TMap>;
  };

export const createModel = <TDoc extends {}>(
  name: string,
  cb?: (api: SearchModelConfig<TDoc, never, never>) => void
) => {
  const f = finalize(name, { state: { name } });

  if (cb) {
    const api = modelConfigApi<TDoc>(name, f);
    cb(api);
  } else {
    // default config
  }

  return {
    ...state,
    toString() {
      return `Model(${name}::${state.hash})`;
    },
  } as SearchModel<TDoc, TMap>;
};
