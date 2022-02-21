import { IConsolidatedModel, IApiModel } from "~/models";
import { ModelMapper } from "~/types";
import { IndexRank } from "../ConsolidatedMapper";

export const ApiToConsolidated: ModelMapper<IApiModel, IConsolidatedModel> = (i) => ({
  objectID: i.id,
  from: "api",
  rank: IndexRank.repo,

  sections: null,
  sub_sections: null,

  symbol: i.name,
  kind: i.kind,
  area: i.module,
  language: i.language,

  content: null,
  tags: i.tags || [],
  text: i.comment?.trim()?.slice(0, 40) || "",

  // compatibility props
  hierarchy_lvl0: "API Docs",
  hierarchy_lvl1: i.name,
  hierarchy_lvl2: i.comment?.trim()?.slice(0, 20) || null,
  hierarchy_lvl3: i.declaration || null,
  hierarchy_lvl4: null,
  hierarchy_lvl5: null,
  hierarchy_lvl6: null,

  url: i.url,
});
