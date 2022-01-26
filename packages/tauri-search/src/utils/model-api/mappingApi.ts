import { MapperDictionary, MsAddOrReplace } from "~/types";
import { MeiliSearchApi } from "../MeiliSearchApi";

export function mappingApi<
  TDoc extends {},
  TMap extends MapperDictionary<string, any, TDoc>
>(idx: string, mappings: TMap) {
  return {
    mapWith: <K extends keyof TMap>(
      map: K,
      data: Parameters<TMap[K]["map"]>[0]
    ): TDoc => {
      return mappings[map].map(data) as TDoc;
    },

    updateWith: async <K extends keyof TMap, D extends Parameters<TMap[K]["map"]>[0]>(
      map: K,
      data: D
    ): Promise<MsAddOrReplace> => {
      const { endpoints } = MeiliSearchApi(idx);
      const doc = mappings[map].map(data);
      return endpoints.addOrReplaceDocuments(doc);
    },
  };
}
