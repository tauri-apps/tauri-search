import {
  MapperDictionary,
  ModelMapper,
  RankingRule,
  RankingRulesApi,
  SearchModelConfig,
  SearchModelState,
} from "~/types";
import { rankingRules } from "./rankingRules";

/**
 * Higher order fn for managing configuration of a Model.
 *
 * In this first call you just pass in the `TDoc` generic
 * along with the model name. This will return a Tuple
 * with the config API and a function to call for results.
 */
export const modelConfigApi = <TDoc extends {}>(
  /** the name of the index */
  name: string,
  /**
   * A callback function which allows the configurator to call during configuration
   * process so that `createModel()` can pull out the final configuration.
   */
  finalize: <F extends SearchModelState<TDoc, MapperDictionary<string, {}, TDoc>>>(
    state: F
  ) => void
) => {
  const api = <
    TMap extends MapperDictionary<string, any, TDoc> = never,
    TExclude extends string = never
  >(
    state: SearchModelState<TDoc, TMap, TExclude>
  ): SearchModelConfig<TDoc, TMap, TExclude> =>
    ({
      searchable(...props: (keyof TDoc)[]) {
        return api<TMap, TExclude | "searchable">({
          ...state,
          index: {
            ...state.index,
            searchable: props,
          },
        });
      },
      displayed(...props: (keyof TDoc)[]) {
        return api<TMap, TExclude | "displayed">({
          ...state,
          index: {
            ...state.index,
            displayed: props,
          },
        });
      },
      distinct(...props: (keyof TDoc)[]) {
        return api<TMap, TExclude | "distinct">({
          ...state,
          index: {
            ...state.index,
            distinct: props,
          },
        });
      },
      filterable(...props: (keyof TDoc)[]) {
        return api<TMap, TExclude | "filterable">({
          ...state,
          index: {
            ...state.index,
            filterable: props,
          },
        });
      },
      sortable(...props: (keyof TDoc)[]) {
        return api<TMap, TExclude | "sortable">({
          ...state,
          index: {
            ...state.index,
            sortable: props,
          },
        });
      },
      stopWords(words: string[]) {
        return api<TMap, TExclude | "sortable">({
          ...state,
          index: {
            ...state.index,
            stopWords: words,
          },
        });
      },

      rankingRules(cb: (r: RankingRulesApi) => void) {
        let r: RankingRule[] = [];
        const update = (rules: RankingRule[]) => {
          r = rules;
        };
        const ruleApi = rankingRules(update);
        cb(ruleApi);

        return api<TMap, TExclude | "sortable">({
          ...state,
          index: {
            ...state.index,
            rank: r,
          },
        });
      },

      addMapper<N extends string>(mapName: N) {
        return {
          mapDefn: <TInput extends {}>(mapper: ModelMapper<TInput, TDoc>) => {
            return api<TMap & Record<N, ModelMapper<TInput, TDoc>>, TExclude>({
              ...state,
              mappers: { ...state.mappers, [mapName]: mapper },
            });
          },
        };
      },
    } as unknown as SearchModelConfig<TDoc, TMap, TExclude>);

  const response = {
    finalize,
    api,
  };

  return api();
};
