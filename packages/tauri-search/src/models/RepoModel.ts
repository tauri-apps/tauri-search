import { en } from "~/stop-words";
import { datetime, url } from "~/types/aliases";
import { createModel } from "~/utils/createModel";

export interface IRepoModel {
  id: string;
  name: string;
  description: string | null;
  kind: "code" | "plugin" | "documentation" | "other" | "unknown";

  stars: number;
  watchers: number;
  subscribers: number;
  openIssues: number;
  forks: number;

  defaultBranch: string;
  language: string | null;
  topics?: string[];
  isTemplate?: boolean;

  lastUpdated: datetime;
  createdAt: datetime;

  license?: string;

  text: string;
  url: url;
}

export const RepoModel = createModel<IRepoModel>("repo", (c) =>
  c //
    .searchable("name", "description", "topics")
    .stopWords(en)
    .synonyms({
      ts: ["typescript", "javascript", "js"],
      js: ["typescript", "javascript", "js"],
      typescript: ["ts", "javascript", "js"],
      javascript: ["ts", "typescript", "js"],
    })
);
