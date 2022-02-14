/* eslint-disable no-console */
import { readFile } from "fs/promises";
import { IDocsSitemap } from "~/pipelines";
import { IApiModel, IProseModel, IRepoModel } from "..";
import { getEnv } from "./getEnv/node/getEnv";

export enum CacheKind {
  sitemap = "Sitemap of Markdown files",
  proseDocs = "Prose/Markdown docs",
  repoDocs = "Repo docs",
  typescriptDocs = "Typescript API docs",
  rustDocs = "Rust API docs",
}

export interface GetCacheOptions {
  repo?: string;
  branch?: string;
}

export async function getCache<K extends CacheKind>(
  kind: K,
  options: GetCacheOptions = {}
) {
  const { repo, branch } = { ...getEnv(), ...options };
  let cache;
  let cacheFile;

  switch (kind) {
    case CacheKind.sitemap:
      cacheFile = `src/generated/sitemap-${repo}-${branch}.json`;
      try {
        cache = await readFile(cacheFile, "utf-8").then(
          (c) => JSON.parse(c) as IDocsSitemap
        );
      } catch (err) {
        cache = undefined;
        console.warn(`- no cache file found at: ${cacheFile}`);
      }
      break;

    case CacheKind.proseDocs:
      cacheFile = `src/generated/prose/${repo}_${branch}/documents.json`;
      try {
        cache = await readFile(cacheFile, "utf-8").then(
          (c) => JSON.parse(c) as IProseModel[]
        );
      } catch (err) {
        console.warn(`- no Prose cache file found at: ${cacheFile}`);
        cache = [];
      }
      break;

    case CacheKind.repoDocs:
      cacheFile = `src/generated/repos/documents.json`;
      try {
        cache = await readFile(cacheFile, "utf-8").then(
          (c) => JSON.parse(c) as IRepoModel[]
        );
      } catch (err) {
        console.warn(`- no Repo cache file found at: ${cacheFile}`);
        cache = [];
      }
      break;

    case CacheKind.typescriptDocs:
      cacheFile = `src/generated/api/${repo}_${branch}/ts-documents.json`;
      try {
        cache = await readFile(cacheFile, "utf-8").then(
          (c) => JSON.parse(c) as IApiModel[]
        );
      } catch (err) {
        console.warn(`- no Typescript docs cache found at: ${cacheFile}`);
        cache = [];
      }
      break;

    case CacheKind.rustDocs:
      cacheFile = `src/generated/api/${repo}_${branch}/rs-documents.json`;
      cache = await readFile(cacheFile, "utf-8").then(
        (c) => JSON.parse(c) as IApiModel[]
      );
      break;

    default:
      cache = undefined;
  }

  type Content = K extends CacheKind.sitemap
    ? IDocsSitemap | undefined
    : K extends CacheKind.proseDocs | undefined
    ? IProseModel[]
    : K extends CacheKind.repoDocs
    ? IRepoModel[]
    : K extends CacheKind.typescriptDocs | undefined
    ? IApiModel[]
    : undefined;

  return { cache, cacheFile } as { cache: Content; cacheFile: string };
}
