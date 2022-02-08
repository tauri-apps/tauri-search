import axios from "axios";
import { GITHUB_API_BASE } from "~/constants";
import { GithubContentsResp } from "~/types";
import { getEnv } from "../getEnv/node/getEnv";

/** returns the markdown text in the README.md file in the root of a repo */
export async function getRepoReadme(
  repoOwner: `${string}/${string}`
): Promise<string | undefined> {
  const { github_token, github_user } = getEnv();
  const url = `${GITHUB_API_BASE}/repos/${repoOwner}/contents/`;
  const res = await axios.get<GithubContentsResp>(url, {
    httpAgent: "Tauri Search",
    ...(github_token && github_user
      ? { auth: { username: github_user, password: github_token } }
      : {}),
  });
  if (res.status < 300) {
    const data = Array.isArray(res.data) ? res.data : [res.data];

    const readme = (data as any).find(
      (i: any) => i.type === "file" && i.name.toLowerCase() === "readme.md"
    );
    if (readme) {
      const content = await axios.get(readme.download_url);
      if (content.status < 300) {
        return content.data as string;
      }
    }
    return undefined;
  }
}
