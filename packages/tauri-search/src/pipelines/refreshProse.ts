import axios from "axios";
import { existsSync, mkdirSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import path, { join } from "node:path";
import { parseMarkdown } from "~/ast/parseMarkdown";
import { ProseMapper } from "~/mappers";
import { IProseModel } from "~/models/ProseModel";
import { flattenSitemap, sitemapDictionary } from "~/utils/convertSitemap";
import { IDocsSitemap, refreshSitemap } from "./refreshSitemap";

/* eslint-disable no-console */
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

export function proseDocsCacheFile(repo: string, branch: string) {
  const dir = `src/generated/ast/prose/${repo}_${branch}`;
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return join(dir, "documents.json");
}

async function cacheMarkdownAst(file: string, url: string, repo: string, branch: string) {
  const jsonFile = jsonFileFromMarkdown(file, repo, branch);
  const content = (await axios.get(url)).data;
  const ast = await parseMarkdown({ file, content });
  await write(jsonFile, JSON.stringify(ast));
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

  const newSitemap = await refreshSitemap({ repo, ref: branch });
  const flatmap = flattenSitemap(newSitemap);
  const documents: IProseModel[] = [];
  const unchangedDocuments: IProseModel[] = [];
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
      } else {
        unchangedDocuments.push(
          ProseMapper(
            await cacheMarkdownAst(file.filepath, file.download_url, repo, branch)
          )
        );
      }
    } else {
      changed.push(file.filepath);
      // console.log(`- change in "${file.filepath}" detected`);
      documents.push(
        ProseMapper(
          await cacheMarkdownAst(file.filepath, file.download_url, repo, branch)
        )
      );
    }
  }
  if (changed.length === 0 && !options.force) {
    console.log(`- all AST cache files remain valid; nothing new written to cache`);
    if (!existsSync(proseDocsCacheFile(repo, branch))) {
      console.log(
        `- while AST files exist, the documents cache was missing and will be refreshed`
      );
      await writeFile(
        proseDocsCacheFile(repo, branch),
        JSON.stringify(unchangedDocuments)
      );
    }
  } else {
    console.log(
      `- finished writing markdown AST files [ ${changed.length} changed, ${unchanged.length} unchanged]`
    );
    await write(proseDocsCacheFile(repo, branch), JSON.stringify(documents));
    console.log(`- wrote Meilisearch documents to "${proseDocsCacheFile(repo, branch)}"`);
  }

  if (currentSitemap) {
    // look for files which have been removed, since last time
    // const current = flattenSitemap(JSON.parse(await readFile(sitemapFile, "utf-8")));
    // const lookup = sitemapDictionary(newSitemap);
    // const removed = current.filter((c) => !lookup[c.filepath]).map((i) => i.filepath);
    // if (removed.length > 0) {
    //   console.log(
    //     `- detected ${removed.length} files which no longer exist: ${removed.join(", ")}`
    //   );
    //   for (const file of removed) {
    //     await rm(jsonFileFromMarkdown(file, repo, branch));
    //   }
    // }
  }

  const sitemap = `src/generated/sitemap-${repo}-${branch}.json`;

  await writeFile(sitemap, JSON.stringify(currentSitemap), "utf-8");
  console.log(`- wrote Repo Sitemap to: ${sitemap}`);

  return { };
}
