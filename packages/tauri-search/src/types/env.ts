import { Stage } from "./model";

export interface IEnv {
  org: string;
  repo: string;
  branch: string;

  stage: Stage;

  docsPath: string;
  /**
   * the full filename path to the AST JSON file exported by
   */
  tsAstPath: string;

  adminKey?: string;
  searchKey?: string;

  github_token?: string;
  github_user?: string;
  force?: boolean;
}
