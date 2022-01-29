import { Endpoints } from "@octokit/types";

export type GithubContentsReq =
  Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["parameters"];
export type GithubContentsResp =
  Endpoints["GET /repos/{owner}/{repo}/contents/{path}"]["response"]["data"];

export type GithubRepoReq = Endpoints["GET /repos/{owner}/{repo}"]["request"];
export type GithubRepoResp = Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"];
