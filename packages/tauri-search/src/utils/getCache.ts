import { readFile } from "fs/promises";
import { IDocsSitemap } from "~/pipelines";
import { IApiModel, IProseModel, IRepoModel } from "..";
import { getEnv } from "./getEnv";

export enum CacheKind {
  sitemap = "Sitemap of Markdown files",
  proseDocs = "Prose/Markdown docs",
  repoDocs = "Repo docs",
  typescriptDocs = "Typescript API docs",
  rustDocs = "Rust API docs"
}

export interface GetCacheOptions {
  repo?:string;
  branch?: string;
}

export async function getCache<K extends CacheKind>(kind: K, options: GetCacheOptions = {}) {
  const {repo, branch} = {...getEnv(),  ...options};
  let content;

  try {
    switch(kind) {
      case CacheKind.sitemap:
        content =  await readFile(`src/generated/sitemap-${repo}-${branch}.json`, "utf-8").then(c => JSON.parse(c) as IDocsSitemap);
        break;

      case CacheKind.proseDocs:
        content =  await readFile(`src/generated/prose/${repo}_${branch}/documents.json`, "utf-8").then(c => JSON.parse(c) as IProseModel[]);
        break;

      case CacheKind.repoDocs:
        content =  await readFile(`src/generated/repos/documents.json`, "utf-8").then(c => JSON.parse(c) as IRepoModel[]);
        break;

      case CacheKind.typescriptDocs:
        content =  await readFile(`src/generated/api/${repo}_${branch}/ts-documents.json`, "utf-8").then(c => JSON.parse(c) as IApiModel[]);
        break;

      case CacheKind.rustDocs:
        content =  await readFile(`src/generated/api/${repo}_${branch}/rs-documents.json`, "utf-8").then(c => JSON.parse(c) as IApiModel[]);
        break;
  
      default:
        content = undefined;
    }

    return content as K extends CacheKind.sitemap ? IDocsSitemap | undefined : K extends CacheKind.proseDocs | undefined? IProseModel[] : K extends CacheKind.repoDocs ? IRepoModel[]| undefined : K extends CacheKind.typescriptDocs | undefined ? IApiModel[] : undefined;
  } catch (e) {
    console.warn(e);
    
    // throw new Error(`Problem loading "${kind}" generated cache file: ${(e as Error).message}`);
    return undefined;
  }

}