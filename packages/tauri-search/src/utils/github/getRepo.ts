import axios from "axios";
import { GITHUB_API_BASE } from "~/constants";
import { GithubRepoResp } from "~/types";
import { getEnv } from "../getEnv";

export async function getRepo(ownerRepo: `${string}/${string}`): Promise<GithubRepoResp> {
  const url = `${GITHUB_API_BASE}/repos/${ownerRepo}`;
  const { github_token, github_user } = getEnv();
  const res = await axios.get<GithubRepoResp>(url, {
    httpAgent: "Tauri Search",
    ...(github_token && github_user
      ? { auth: { username: github_user, password: github_token } }
      : {}),
  });

  if (res.status < 300) {
    return res.data as GithubRepoResp;
  } else {
    throw new Error(
      `Problem getting Github repo at: ${url}. Error [${res.status}]: ${res.statusText}`
    );
  }
}
