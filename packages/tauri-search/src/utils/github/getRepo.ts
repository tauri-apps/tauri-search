import { Endpoints } from "@octokit/types";
import axios from "axios";
import { GITHUB_API_BASE } from "~/constants";

export type GithubRepoReq = Endpoints["GET /repos/{owner}/{repo}"]["request"];
export type GithubRepoResp = Endpoints["GET /repos/{owner}/{repo}"]["response"];

export async function getRepo(
  ownerRepo: `${string}/${string}`
): Promise<GithubRepoResp["data"]> {
  const url = `${GITHUB_API_BASE}/repos/${ownerRepo}`;
  const res = await axios.get(url);

  if (res.status < 300) {
    return res.data as GithubRepoResp["data"];
  } else {
    throw new Error(
      `Problem getting Github repo at: ${url}. Error [${res.status}]: ${res.statusText}`
    );
  }
}
