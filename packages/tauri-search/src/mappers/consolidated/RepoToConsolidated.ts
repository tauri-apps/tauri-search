import { IConsolidatedModel, IRepoModel } from "~/models";
import { ModelMapper } from "~/types";
import { IndexRank } from "../ConsolidatedMapper";

export const RepoToConsolidated: ModelMapper<IRepoModel, IConsolidatedModel> = (i) => ({
  objectID: i.id,
  from: "repo",
  rank: IndexRank.repo,

  sections: null,
  sub_sections: null,

  symbol: null,
  area: i.kind === "unknown" ? null : i.kind || null,
  language: i.language,

  tags: i.topics || [],
  text: i.text.trim().slice(0, 20),

  // compatibility props
  content: i.topics?.join(", ") || null,
  hierarchy_lvl0: "Repository",
  hierarchy_lvl1: i.name,
  hierarchy_lvl2: i.description,
  hierarchy_lvl3: null,
  hierarchy_lvl4: null,
  hierarchy_lvl5: null,
  hierarchy_lvl6: null,

  url: i.url,
});
