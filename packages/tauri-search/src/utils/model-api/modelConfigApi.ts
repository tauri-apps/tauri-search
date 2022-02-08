import { IndexApi, PartialModel, RankingRule, RankingRulesApi } from "~/types";
import { rankingRules } from "./rankingRules";

export const modelConfigApi = <TDoc extends {}>(
  update: (s: PartialModel<TDoc>) => void
) => {
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
