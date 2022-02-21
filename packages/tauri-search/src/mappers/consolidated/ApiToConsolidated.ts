import { capitalize } from "native-dash";
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

  tags: i.tags || [],
  text: i.comment?.trim()?.slice(0, 40) || "",

  // compatibility props
  content:
    i.module !== i.name
      ? `Module ${i.module} in ${capitalize(i.language)} API docs`
      : `${capitalize(i.language)} API docs`,
  hierarchy_lvl0: "API Docs",
  hierarchy_lvl1: i.name,
  hierarchy_lvl2: i.kind?.replace("Namespace", "Module") || null,
  hierarchy_lvl3: i.declaration || null,
  hierarchy_lvl4: null,
  hierarchy_lvl5: null,
  hierarchy_lvl6: null,

  url: i.url,
});
