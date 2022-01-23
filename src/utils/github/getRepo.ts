import { Endpoints } from "@octokit/types";
import fetch from "node-fetch";
import { GITHUB_API_BASE } from "~/constants";

export type GithubRepoReq = Endpoints["GET /repos/{owner}/{repo}"]["request"];
export type GithubRepoResp = Endpoints["GET /repos/{owner}/{repo}"]["response"];

export async function getRepo(ownerRepo: `${string}/${string}`) {
  const url = `${GITHUB_API_BASE}/repos/${ownerRepo}`;
  const res = await fetch(url);

  if (res.ok) {
    return (await res.json()) as GithubRepoResp["data"];
  } else {
    throw new Error(`Problem loading Github URL: ${url}. Error status: ${res.status}`);
  }
}
