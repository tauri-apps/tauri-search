import { datetime, url } from "~/types/aliases";
import { createModel } from "~/utils/createModel";

export interface RepoModel {
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

  // latestVersion: string;
  lastUpdated: datetime;
  createdAt: datetime;

  license?: string;

  text: string;
  url: url;
}

export const RepoModel = createModel<RepoModel>("repo");
