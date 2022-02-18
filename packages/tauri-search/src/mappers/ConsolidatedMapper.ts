import { ModelMapper, isApiDocument, isProseDocument } from "~/types";
import {
  ApiToConsolidated,
  ProseToConsolidated,
  RepoToConsolidated,
} from "./consolidated";
import { IApiModel, IConsolidatedModel, IProseModel, IRepoModel } from "~/models";

export enum IndexRank {
  prose = 2,
  repo = 3,
  api = 5,
}

export const ConsolidatedMapper: ModelMapper<
  IApiModel | IRepoModel | IProseModel,
  IConsolidatedModel
> = (i) =>
  isApiDocument(i)
    ? ApiToConsolidated(i)
    : isProseDocument(i)
    ? ProseToConsolidated(i)
    : RepoToConsolidated(i);
