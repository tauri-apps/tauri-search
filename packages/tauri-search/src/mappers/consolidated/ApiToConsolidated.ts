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
  content: i.declaration || null,
  hierarchy_lvl0: "API Docs",
  hierarchy_lvl1: i.name,
  hierarchy_lvl2:
    i.module !== i.name
      ? `${capitalize(i.language)} > ${i.module} Module > ${i.kind?.replace(
          "Namespace",
          "Module"
        )} > ${i.name}`
      : `${capitalize(i.language)} > ${i.kind?.replace("Namespace", "Module")} > ${
          i.name
        }`,
  hierarchy_lvl3: null,
  hierarchy_lvl4: null,
  hierarchy_lvl5: null,
  hierarchy_lvl6: null,

  url: i.url,
});
