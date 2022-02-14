import { IConsolidatedModel, IApiModel } from "~/models";
import { ModelMapper } from "~/types";
import { IndexRank } from "../ConsolidatedMapper";

export const ApiToConsolidated: ModelMapper<IApiModel, IConsolidatedModel> = i => ({
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
  text: i.comment || "",

  // compatibility props
  hierarchy_lvl0: i.name,
  hierarchy_lvl1: i.comment || null,
  hierarchy_lvl2: i.declaration || null,
  hierarchy_lvl3: null,
  hierarchy_lvl4: null,
  hierarchy_lvl5: null,
  hierarchy_lvl6: null,

  url: i.url
});