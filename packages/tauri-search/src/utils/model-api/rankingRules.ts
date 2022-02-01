import { RankingRule, RankingRulesApi } from "~/types/apis";

export const rankingRules = (update: (r: RankingRule[]) => void) => {
  const api = <E extends RankingRule = never>(
    rules: RankingRule[] = []
  ): RankingRulesApi<E> => {
    return {
      typo: () => {
        const updated = [...rules, "typo"] as RankingRule[];
        update(updated);

        return api<E | "typo">(updated);
      },

      proximity: () => {
        const updated = [...rules, "proximity"] as RankingRule[];
        update(updated);
        return api<E | "proximity">(updated);
      },

      attribute: () => {
        const updated = [...rules, "attribute"] as RankingRule[];
        update(updated);
        return api<E | "attribute">(updated);
      },

      exactness: () => {
        const updated = [...rules, "exactness"] as RankingRule[];
        update(updated);
        return api<E | "exactness">(updated);
      },

      sort: () => {
        const updated = [...rules, "sort"] as RankingRule[];
        update(updated);
        return api<E | "sort">(updated);
      },
      words: () => {
        const updated = [...rules, "words"] as RankingRule[];
        update(updated);
        return api<E | "words">(updated);
      },
    } as unknown as RankingRulesApi<E>;
  };

  return api();
};
