import { ModelMapper, isRepoDocument, isApiDocument } from "~/types";
import { IApiModel, IConsolidatedModel, IProseModel, IRepoModel } from "~/models";

export enum IndexRank {
  prose = 5,
  repo = 3,
  api = 2,
}

export const ConsolidatedMapper: ModelMapper<
  IApiModel | IRepoModel | IProseModel,
  IConsolidatedModel
> = (i): IConsolidatedModel => ({
  id: i.id,
  lvl0: isRepoDocument(i) ? i.name : isApiDocument(i) ? i.name : i.title,
  lvl1: isRepoDocument(i)
    ? i.description || null
    : isApiDocument(i)
    ? i.module
    : i.tags?.join(" ") || null,
  lvl2: isRepoDocument(i)
    ? i.kind || null
    : isApiDocument(i)
    ? i.comment || null
    : i.sections?.join(" ") || null,
  lvl3: isRepoDocument(i)
    ? i.topics?.join(" ") || null
    : isApiDocument(i)
    ? i.language || null
    : i.subSections?.join(" ") || null,
  lvl4: isRepoDocument(i)
    ? i.language || null
    : isApiDocument(i)
    ? null
    : i.category || null,
  lvl5: isRepoDocument(i)
    ? i.license || null
    : isApiDocument(i)
    ? null
    : i.code?.join(" ") || null,
  lvl6: isRepoDocument(i) ? String(i.stars) || null : isApiDocument(i) ? null : null,
  from: isRepoDocument(i) ? "repo" : isApiDocument(i) ? "api" : "prose",
  symbol: isApiDocument(i) ? i.kind : null,
  language: isApiDocument(i)
    ? i.language
    : isRepoDocument(i)
    ? i.language
    : i.code?.pop() || null,

  content: isRepoDocument(i) ? i.text : isApiDocument(i) ? null : i.text,
  rank: isRepoDocument(i)
    ? IndexRank.repo
    : isApiDocument(i)
    ? IndexRank.api
    : IndexRank.prose,
  url: i.url,
});
