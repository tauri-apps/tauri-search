import { en } from "~/stop-words";
import { IScrapeSelectorTargets } from "~/types";
import { createModel } from "~/utils/createModel";

export type IConsolidatedModel = Omit<
  IScrapeSelectorTargets,
  | "hierarchy_radio_lvl0"
  | "hierarchy_radio_lvl1"
  | "hierarchy_radio_lvl2"
  | "hierarchy_radio_lvl3"
  | "hierarchy_radio_lvl4"
  | "hierarchy_radio_lvl5"
> & {
  anchor_l2: string[] | null;
  anchor_l3: string[] | null;
  area?: string;
  from: "prose" | "api" | "repo";
  rank: number;
  symbol: string | null;
  tags: null | string[];
  language: string | null;
  text: string | null;
};

export const ConsolidatedModel = createModel<IConsolidatedModel>("consolidated", (c) =>
  c
    .pk("objectID")
    .stopWords(en)
    .synonyms({
      ts: ["typescript", "javascript", "js"],
      js: ["typescript", "javascript", "js"],
      typescript: ["ts", "javascript", "js"],
      javascript: ["ts", "typescript", "js"],
    })
    .filterable("from", "language", "symbol")
    .searchable(
      "area",
      "hierarchy_lvl0",
      "hierarchy_lvl1",
      "anchor_l2",
      "symbol",
      "rank",
      "tags",
      "content",
      "hierarchy_lvl2",
      "hierarchy_lvl3",
      "anchor_l3"
    )
    .rankingRules((r) =>
      r.words().typo().sort().attribute().proximity().ASC("rank").exactness()
    )
);
