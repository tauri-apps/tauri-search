import { Endpoints } from "@octokit/types";
import axios from "axios";
import { GITHUB_API_BASE } from "~/constants";

export type GithubCommitsReq = Endpoints["GET /repos/{owner}/{repo}/commits"]["request"];
export type GithubCommitsResp =
  Endpoints["GET /repos/{owner}/{repo}/commits"]["response"];
export type IGithubCommitsOptions = {
  page?: number;
  per_page?: number;
  sha?: string;
  path?: string;
  since?: string;
  until?: string;
};

export async function getCommits(
  ownerRepo: `${string}/${string}`,
  qp: IGithubCommitsOptions
): Promise<GithubCommitsResp> {
  const url = `${GITHUB_API_BASE}/repos/${ownerRepo}/commits`;
  const params: IGithubCommitsOptions = { page: 1, per_page: 3, ...qp };
  return axios.get(url, { params });
}
