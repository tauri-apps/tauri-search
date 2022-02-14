import { getRepo } from "./getRepo";

export async function getRepoDefaultBranch(repo: `${string}/${string}`) {
  const r = await getRepo(repo);
  return r.default_branch;
}
