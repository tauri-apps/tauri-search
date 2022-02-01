import { en } from "~/stop-words";
import { IScrapeSelectorTargets } from "~/types";
import { createModel } from "~/utils/createModel";

export type IConsolidatedModel = IScrapeSelectorTargets & {
  from: "prose" | "api" | "repo";
  symbol: string | null;
  language: string | null;
};

export const ConsolidatedModel = createModel<IConsolidatedModel>("consolidated", (c) =>
  c.stopWords(en)
);
