import { RankingRule, RankingRulesApi } from "~/types/apis";

export const rankingRules = <TDoc extends {}>(update: (r: RankingRule<TDoc>[]) => void) => {
  const api = <TDoc, E extends RankingRule = never>(
    rules: RankingRule<TDoc>[] = []
  ): RankingRulesApi<TDoc, E> => {
    return {
      typo: () => {
        const updated = [...rules, "typo"] as RankingRule<TDoc>[];
        update(updated);

        return api<TDoc, E | "typo">(updated);
      },

      proximity: () => {
        const updated = [...rules, "proximity"] as RankingRule<TDoc>[];
        update(updated);
        return api<TDoc, E | "proximity">(updated);
      },

      attribute: () => {
        const updated = [...rules, "attribute"] as RankingRule<TDoc>[];
        update(updated);
        return api<TDoc, E | "attribute">(updated);
      },

      exactness: () => {
        const updated = [...rules, "exactness"] as RankingRule<TDoc>[];
        update(updated);
        return api<TDoc, E | "exactness">(updated);
      },

      sort: () => {
        const updated = [...rules, "sort"] as RankingRule<TDoc>[];
        update(updated);
        return api<TDoc, E | "sort">(updated);
      },
      words: () => {
        const updated = [...rules, "words"] as RankingRule<TDoc>[];
        update(updated);
        return api<TDoc, E | "words">(updated);
      },
      /**
       * Make a property in the Model serve as a ranking rule, using
       * ascending order to rank.
       */
      ASC: (prop: keyof TDoc) => {
        const updated = [...rules, `${prop}:asc`] as RankingRule<TDoc>[];
        update(updated);
        return api<TDoc, E>(updated);
      },
      DESC: (prop: keyof TDoc) => {
        const updated = [...rules, `${prop}:desc`] as RankingRule<TDoc>[];
        update(updated);
        return api<TDoc, E>(updated);
      },
    } as unknown as RankingRulesApi<TDoc, E>;
  };

  return api();
};
