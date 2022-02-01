import { IApiModel, IProseModel, IRepoModel } from "~/models";

/**
 * Gets the document cache for a given index
 */
export async function getCache(
  index: "api" | "prose" | "repo",
  _options: { repo?: string; branch?: string } = {}
): Promise<(IProseModel | IRepoModel | IApiModel)[]> {
  switch (index) {
    case "prose":
      return (await import(`~/generated/ast/prose/tauri_dev/documents.json`))
        .default as IProseModel[];
    case "repo":
      return (await import("~/generated/ast/repo/documents.json"))
        .default as IRepoModel[];
    case "api":
      return (await import("~/generated/ast/api/ts-documents.json"))
        .default as IApiModel[];
  }
}
