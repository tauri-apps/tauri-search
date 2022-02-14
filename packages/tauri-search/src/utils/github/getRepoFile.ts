import { getUrl } from "../getUrl";
import { getRepoDefaultBranch } from "./getRepoDefaultBranch";

/**
 * Gets the raw content from a file in a github repo
 *
 * @param repo repo name in form of `owner/name`
 * @param filepath path from root of repo to the file (including file extension)
 * @param branch optionally specify a branch; will default to repo's default branch if not specified
 */
export async function getRepoFile(
  repo: `${string}/${string}`,
  filepath: string,
  branch?: string
) {
  if (!branch) {
    branch = await getRepoDefaultBranch(repo);
  }
  const url = `https://raw.githubusercontent.com/${repo}/${branch}/${filepath}`;
  return getUrl(url);
}
