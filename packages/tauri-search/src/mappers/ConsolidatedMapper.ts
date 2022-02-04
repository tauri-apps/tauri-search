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
  hierarchy_lvl0: isRepoDocument(i) ? i.name : isApiDocument(i) ? i.name : i.title,
  hierarchy_lvl1: isRepoDocument(i)
    ? i.description || null
    : isApiDocument(i)
    ? i.module
    : i.tags?.join(" ") || null,
  hierarchy_lvl2: isRepoDocument(i)
    ? i.kind || null
    : isApiDocument(i)
    ? null
    : i.sections?.join(" ") || null,
  hierarchy_lvl3: isRepoDocument(i)
    ? i.topics?.join(" ") || null
    : isApiDocument(i)
    ? i.language || null
    : i.subSections?.join(" ") || null,
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
  hierarchy_lvl6: isRepoDocument(i) ? String(i.stars) || null : isApiDocument(i) ? null : null,
  from: isRepoDocument(i) ? "repo" : isApiDocument(i) ? "api" : "prose",
  symbol: isApiDocument(i) ? i.kind : null,
  language: isApiDocument(i)
    ? i.language
    : isRepoDocument(i)
    ? i.language
    : i.code?.pop() || null,

  content: isRepoDocument(i) ? i.text : isApiDocument(i) ? i.comment || null : i.text,
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
