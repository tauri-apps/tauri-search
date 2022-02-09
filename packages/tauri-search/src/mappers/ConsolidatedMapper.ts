import { ModelMapper, isRepoDocument, isApiDocument } from "~/types";
import { IApiModel, IConsolidatedModel, IProseModel, IRepoModel } from "~/models";

export enum IndexRank {
  prose = 2,
  repo = 3,
  api = 5,
}

export const ConsolidatedMapper: ModelMapper<
  IApiModel | IRepoModel | IProseModel,
  IConsolidatedModel
> = (i): IConsolidatedModel => ({
  objectID: i.id,
  anchor: i.id,
  hierarchy_lvl0: isRepoDocument(i)
    ? i.name
    : isApiDocument(i)
    ? i.name || null
    : i.title,
  hierarchy_lvl1: isRepoDocument(i)
    ? i.topics?.join(" ") || null
    : isApiDocument(i)
    ? i.module || null
    : i.tags?.join(" ") || null,
  hierarchy_lvl2: isRepoDocument(i)
    ? i.kind === "unknown"
      ? null
      : i.kind || null
    : isApiDocument(i)
    ? i.language
    : i.sections?.join(" ") || null,
  hierarchy_lvl3: isRepoDocument(i)
    ? i.description || null
    : isApiDocument(i)
    ? i.module
    : i.tags?.join(" ") || null,
  hierarchy_lvl4: isRepoDocument(i)
    ? i.language || null
    : isApiDocument(i)
    ? null
    : i.category || null,
  hierarchy_lvl5: isRepoDocument(i)
    ? i.license || null
    : isApiDocument(i)
    ? null
    : i.code?.join(" ") || null,
  hierarchy_lvl6: isRepoDocument(i)
    ? String(i.stars) || null
    : isApiDocument(i)
    ? null
    : null,
  from: isRepoDocument(i) ? "repo" : isApiDocument(i) ? "api" : "prose",
  symbol: isApiDocument(i) ? i.kind : null,
  language: isApiDocument(i)
    ? i.language
    : isRepoDocument(i)
    ? i.language
    : i.code?.pop() || null,
  tags: isRepoDocument(i) ? i.topics || null : isApiDocument(i) ? null : i.tags || null,
  content: isRepoDocument(i)
    ? i.topics?.join(" ") || null
    : isApiDocument(i)
    ? i.declaration || null
    : i.subSections?.join(" ") || null,

  text: isApiDocument(i) ? i.comment || null : i.text || null,
  rank: isRepoDocument(i)
    ? IndexRank.repo
    : isApiDocument(i)
    ? IndexRank.api
    : IndexRank.prose,
  hierarchy_radio_lvl0: null,
  hierarchy_radio_lvl1: null,
  hierarchy_radio_lvl2: null,
  hierarchy_radio_lvl3: null,
  hierarchy_radio_lvl4: null,
  hierarchy_radio_lvl5: null,
  url: i.url,
});
