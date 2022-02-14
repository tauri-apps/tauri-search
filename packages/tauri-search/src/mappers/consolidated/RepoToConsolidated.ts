import { IConsolidatedModel, IRepoModel } from "~/models";
import { ModelMapper } from "~/types";
import { IndexRank } from "../ConsolidatedMapper";

export const RepoToConsolidated: ModelMapper<IRepoModel, IConsolidatedModel> = i => ({
  objectID: i.id,
  from: "repo",
  rank: IndexRank.repo,

  sections: null,
  sub_sections: null,

  symbol: null,
  area: i.kind === "unknown" ? null : i.kind || null,
  language: i.language,

  content: null,
  tags: i.topics || [],
  text: i.text,


  // compatibility props
  hierarchy_lvl0: i.name,
  hierarchy_lvl1: i.description,
  hierarchy_lvl2: i.kind === "unknown" ? null : i.kind || null,
  hierarchy_lvl3: null,
  hierarchy_lvl4: null,
  hierarchy_lvl5: null,
  hierarchy_lvl6: null,

  url: i.url
});