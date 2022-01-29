import { Endpoints } from "@octokit/types";

export type GithubContentsReq =
  Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["parameters"];
export type GithubContentsResp =
  Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"]["data"];
