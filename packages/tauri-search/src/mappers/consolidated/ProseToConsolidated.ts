import { IConsolidatedModel, IProseModel } from "~/models";
import { ModelMapper } from "~/types";
import { IndexRank } from "../ConsolidatedMapper";

export const ProseToConsolidated: ModelMapper<IProseModel, IConsolidatedModel> = (i) => ({
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
  text: i.text.trim().slice(0, 20) || "",

  // compatibility props
  hierarchy_lvl0: "Documentation",
  hierarchy_lvl1: i.area || "",
  hierarchy_lvl2: i.title,
  hierarchy_lvl3: i.parentSection || null,
  hierarchy_lvl4: null,
  hierarchy_lvl5: null,
  hierarchy_lvl6: null,

  url: i.url,
});
