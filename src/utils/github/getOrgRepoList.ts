import { Endpoints } from "@octokit/types";
import fetch from "node-fetch";
import { GITHUB_API_BASE } from "~/constants";

export type OrgRepoLisReq = Endpoints["GET /orgs/{org}/repos"]["request"];
export type OrgRepoLisResp = Endpoints["GET /orgs/{org}/repos"]["response"];

export async function getOrgRepoList(org: string = "tauri-apps") {
  const url = `${GITHUB_API_BASE}/orgs/${org}/repos?type=public&sort=updated&direction=desc&per_page=30&page=1`;
  const res = await fetch(url);

  if (res.ok) {
    const repos = (await res.json()) as OrgRepoLisResp;
    console.log(
      repos
      // repos.map(
      //   (i) =>
      //     `${i.name} [${i.license?.name}] - stars ${i.stargazers_count}, watchers ${i.watchers_count}`
      // )
    );
  }
}
