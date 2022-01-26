import { IRepoModel } from "~/models/RepoModel";
import { url } from "~/types/aliases";
import { createMapper } from "~/utils/createMapper";
import { GithubRepoResp } from "~/utils/github/getRepo";

/**
 * Maps a **Typescript Module** to the Meilisearch documents for that module.
 */
export const githubMapper = createMapper<GithubRepoResp["data"], IRepoModel>(
  "githubMapper",
  (i) => ({
    id: `github_${i.full_name.replace("/", "_")}`,
    name: i.name,
    description: i.description,
    kind: i.name.includes("plugin")
      ? "plugin"
      : i.language?.toLowerCase().includes("rust")
      ? "code"
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

    text: "",

    url: i.html_url as url,
  })
);

const g = githubMapper.map();
