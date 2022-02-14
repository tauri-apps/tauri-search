import { Endpoints } from "@octokit/types";
import axios from "axios";
import { GITHUB_API_BASE } from "~/constants";

export type OrgRepoLisReq = Endpoints["GET /orgs/{org}/repos"]["request"];
export type OrgRepoLisResp = Endpoints["GET /orgs/{org}/repos"]["response"];

export async function getOrgRepoList(org: string = "tauri-apps") {
  const url = `${GITHUB_API_BASE}/orgs/${org}/repos?type=public&sort=updated&direction=desc&per_page=30&page=1`;

    const repos = axios.get<OrgRepoLisResp>(url);

    return repos;

}
