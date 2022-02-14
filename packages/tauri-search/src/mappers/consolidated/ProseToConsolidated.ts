import { IConsolidatedModel, IProseModel } from "~/models";
import { ModelMapper } from "~/types";
import { IndexRank } from "../ConsolidatedMapper";

export const ProseToConsolidated: ModelMapper<IProseModel, IConsolidatedModel> = i => ({
  objectID: i.id,
  from: "prose",
  rank: IndexRank.prose,

  sections: i.headings || [],
  sub_sections: i.subHeadings || [],

  symbol: null,
  area: i.area || i.section || null,
  language: i.code?.join(" ") || null,

  content: null,
  tags: i.tags || [],
  text: i.text || "",

  // compatibility props
  hierarchy_lvl0: i.title,
  hierarchy_lvl1: i.area || null,
  hierarchy_lvl2: i.parentSection || null,
  hierarchy_lvl3: i.headings?.join(" ") || null,
  hierarchy_lvl4: i.text,
  hierarchy_lvl5: null,
  hierarchy_lvl6: null,

  url: i.url
});