import { Endpoints } from "@octokit/types";
import axios from "axios";
import { GITHUB_API_BASE } from "~/constants";

export type GithubRepoBranchesReq =
  Endpoints["GET /repos/{owner}/{repo}/branches"]["request"];
export type GithubRepoBranchesResp =
  Endpoints["GET /repos/{owner}/{repo}/branches"]["response"];

/**
 * Get's a list of branches for a given repo
 */
export async function getRepoBranches(ownerRepo: `${string}/${string}`) {
  const url = `${GITHUB_API_BASE}/repos/${ownerRepo}/branches&per_page=30&page=1`;
  const res = await axios.get(url);

  if (res.ok) {
    const result = (await res.json()) as GithubRepoBranchesResp["data"];
    return result.map((i) => i.name);
  } else {
    throw new Error(`Problem loading Github URL: ${url}. Error status: ${res.status}`);
  }
}
