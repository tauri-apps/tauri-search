import { RankingRule, RankingRulesApi } from "~/types/apis";

export const rankingRules = (update: (r: RankingRule[]) => void) => {
  const api = <E extends RankingRule = never>(
    rules: RankingRule[] = []
  ): RankingRulesApi<E> => {
    return {
      typo: () => {
        api<E | "typo">([...rules, "typo"]);
      },
      proximity: () => {
        api<E | "proximity">([...rules, "proximity"]);
      },
      attribute: () => {
        api<E | "attribute">([...rules, "attribute"]);
      },
      exactness: () => {
        api<E | "exactness">([...rules, "exactness"]);
      },
      sort: () => {
        api<E | "sort">([...rules, "sort"]);
      },
      words: () => {
        api<E | "words">([...rules, "words"]);
      },
    } as unknown as RankingRulesApi<E>;
  };

  return api();
};
