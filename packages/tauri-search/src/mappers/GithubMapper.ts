import { IRepoModel } from "~/models/RepoModel";
import { url } from "~/types/aliases";
import { GithubRepoResp, ModelMapper } from "~/types";
import { sanitizeDocId } from "~/utils/sanitizeDocId";

/**
 * Maps Github Repo's API response to the appropriate document response for a Repo
 */
export const GithubMapper: ModelMapper<
  GithubRepoResp & { text: string | undefined },
  IRepoModel
> = (i) => ({
  id: sanitizeDocId(`github_${i.full_name}`),
  name: i.name,
  description: i.description,
  kind: i.name.includes("plugin")
    ? "plugin"
    : i.language?.toLowerCase().includes("rust")
    ? "code"
    : i.name.includes("docs")
    ? "documentation"
    : "unknown",

  stars: i.stargazers_count,
  watchers: i.watchers_count,
  subscribers: i.subscribers_count,
  openIssues: i.open_issues_count,
  forks: i.forks_count,

  defaultBranch: i.default_branch,
  language: i.language,
  topics: i.topics,
  isTemplate: i.is_template,

  lastUpdated: i.updated_at,
  createdAt: i.created_at,
  license: i.license?.name,

  text: i.text || "",

  url: i.html_url as url,
});
