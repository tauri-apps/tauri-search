/* eslint-disable no-console */
import axios from "axios";
import { existsSync, mkdirSync } from "fs";
import { readFile, rm, writeFile } from "fs/promises";
import { join } from "node:path";
import path from "path";
import { parseMarkdown } from "~/ast/parseMarkdown";
import { ProseMapper } from "~/mappers";
import { IProseModel } from "~/models/ProseModel";
import { getEnv } from "~/utils/getEnv";
import { flattenSitemap, sitemapDictionary } from "../utils/convertSitemap";
import { buildDocsSitemap, IDocsSitemap } from "../utils/github/buildDocsSitemap";

export interface IRefreshProseOptions {
  force?: boolean;
}

function jsonFileFromMarkdown(file: string, repo: string, branch: string) {
  return join(`src/generated/ast/prose/${repo}_${branch}/`, file.replace(".md", ".json"));
}

/** writes file to local path, ensuring directory exists */
async function write(file: string, data: string) {
  const dir = path.dirname(file);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  await writeFile(file, data, "utf-8");
}

function documentsCacheFile(file: string, repo: string, branch: string) {
  const dir = `src/generated/ast/prose/${repo}_${branch}`;
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return join(dir, file);
}

async function cacheMarkdownAst(file: string, url: string, repo: string, branch: string) {
  const jsonFile = jsonFileFromMarkdown(file, repo, branch);
  const content = (await axios.get(url)).data;
  const ast = await parseMarkdown({ file, content });
  await write(jsonFile, JSON.stringify(ast));
  console.log(`- wrote markdown AST file: ${jsonFile}`);
  return ast;
}

export async function refreshProse(
  repo: string,
  branch: string,
  options: IRefreshProseOptions = {}
) {
  const sitemapFile = `src/generated/sitemap-${repo}-${branch}.json`;
  const existingSitemap = existsSync(sitemapFile);
  if (existingSitemap) {
    console.log(`- existing sitemap found [${sitemapFile}]`);
    console.log(`- will use to detect changes in prose`);
  } else {
    console.log(
      `- no existing sitemap for ${repo}@${branch}; all markdown content will be pulled down`
    );
  }
  const currentSitemap = existingSitemap
    ? sitemapDictionary(JSON.parse(await readFile(sitemapFile, "utf-8")) as IDocsSitemap)
    : {};

  const newSitemap = await buildDocsSitemap({ repo, ref: branch });
  const flatmap = flattenSitemap(newSitemap);
  const documents: IProseModel[] = [];
  const unchanged: string[] = [];
  const changed: string[] = [];
  for (const file of flatmap) {
    const cache = currentSitemap[file.filepath];
    if (cache && cache.sha === file.sha) {
      unchanged.push(file.filepath);
      if (
        options.force ||
        !existsSync(jsonFileFromMarkdown(file.filepath, repo, branch))
      ) {
        documents.push(
          ProseMapper(
            await cacheMarkdownAst(file.filepath, file.download_url, repo, branch)
          )
        );
      }
    } else {
      changed.push(file.filepath);
      console.log(`- change in "${file.filepath}" detected`);
      documents.push(
        ProseMapper(
          await cacheMarkdownAst(file.filepath, file.download_url, repo, branch)
        )
      );
    }
  }
  if (changed.length === 0 && !options.force) {
    console.log(`- all AST cache files remain valid; nothing new written to cache`);
  } else {
    console.log(
      `- finished writing markdown AST files [ ${changed.length} changed, ${unchanged.length} unchanged]`
    );
    await write(
      documentsCacheFile("documents.json", repo, branch),
      JSON.stringify(documents)
    );
    console.log(
      `- wrote Meilisearch documents to "${documentsCacheFile(
        "documents.json",
        repo,
        branch
      )}"`
    );
  }

  if (currentSitemap) {
    // look for files which have been removed, since last time
    const current = flattenSitemap(JSON.parse(await readFile(sitemapFile, "utf-8")));
    const lookup = sitemapDictionary(newSitemap);
    const removed = current.filter((c) => !lookup[c.filepath]).map((i) => i.filepath);
    if (removed.length > 0) {
      console.log(
        `- detected ${removed.length} files which no longer exist: ${removed.join(", ")}`
      );
      for (const file of removed) {
        await rm(jsonFileFromMarkdown(file, repo, branch));
      }
    }
  }
}

(async () => {
  const { repo, branch, force } = getEnv();
  await refreshProse(repo, branch, { force });
})();
