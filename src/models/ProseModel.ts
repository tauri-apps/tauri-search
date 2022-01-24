import { createModel } from "~/utils/createModel";

export interface ProseModel {
  id: string;
  title: string;

  kind: "core" | "plugin" | "documentation" | "other";
  stars: number;
  latestVersion: string;
  description: string;
  body: string;
  url: `https://${string}`;
}

const model = createModel<ProseModel>("prose");

export default model;
