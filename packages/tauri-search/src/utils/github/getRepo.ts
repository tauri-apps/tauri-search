import axios from "axios";
import { GITHUB_API_BASE } from "~/constants";
import { GithubRepoResp } from "~/types";
import { getEnv } from "../getEnv/node/getEnv";

export async function getRepo(repo: `${string}/${string}`): Promise<GithubRepoResp> {
  const url = `${GITHUB_API_BASE}/repos/${repo}`;
  const { github_token, github_user } = getEnv();
  const res = await axios
    .get<GithubRepoResp>(url, {
      httpAgent: "Tauri Search",
      ...(github_token && github_user
        ? { auth: { username: github_user, password: github_token } }
        : {}),
    })
    .catch((err) => {
      if (axios.isAxiosError(err) && err.response) {
        throw new Error(
          `\nProblem calling Github API [repos, ${err.response.status}, ${url}]\n  - message: ${err.response.data?.message}`
        );
      } else {
        throw new Error(`\nProblem calling Github API [repos, ${url}]: ${err.message}`);
      }
    });

  return res.data;
}
