import axios from "axios";
import { existsSync, mkdirSync } from "fs";
import { join } from "node:path";
import { parseMarkdown } from "~/ast/parseMarkdown";
import { ProseMapper } from "~/mappers";
import { IProseModel } from "~/models/ProseModel";
import { IEnv } from "~/types";
import { flattenSitemap } from "~/utils/convertSitemap";
import { CacheKind, getCache } from "~/utils/getCache";
import { getEnv } from "~/utils/getEnv/esm/getEnv";
import { writeCacheFile } from "~/utils/writeCacheFile";
import { refreshSitemap } from "./refreshSitemap";

function jsonFileFromMarkdown(file: string, repo: string, branch: string) {
  return join(`src/generated/ast/prose/${repo}_${branch}/`, file.replace(".md", ".json"));
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
  await writeCacheFile(jsonFile, JSON.stringify(ast));
  return ast;
}

/**
 * Refreshes both the sitemap and then the prose itself based on
 * changes found in sitemap
 */
export async function refreshProse(options: Partial<IEnv> = {}) {
  const { repo, branch, force } = { ...getEnv(), ...options };

  const sm = await refreshSitemap();

  const setChanges = [...sm.changes.added, sm.changes.changed];
  const removals = sm.changes.removed;

  if (setChanges.length + removals.length === 0) {
    return { changes: false };
  }

  const {
    /** prose cache file; will be set to empty array if hadn't previously existed */
    cache: currentDocs,
    cacheFile,
  } = await getCache(CacheKind.proseDocs);

  // reduce to just added/changed docs unless FORCE is set
  const docsToUpdate =
    force || currentDocs.length === 0
      ? flattenSitemap(sm.sitemap)
      : flattenSitemap(sm.sitemap).filter((i) => setChanges.includes(i.filepath));

  const docsPromise: Promise<IProseModel>[] = [];

  // convert markdown files to AST and then again to IProseModel
  for (const file of docsToUpdate) {
    docsPromise.push(
      cacheMarkdownAst(file.filepath, file.download_url, repo, branch).then((i) =>
        ProseMapper(i)
      )
    );
  }

  const updatedDocs = await Promise.all(docsPromise);
  const updatedKeys = updatedDocs.map((i) => i.id);

  const docs =
    force || currentDocs.length === 0
      ? updatedDocs
      : currentDocs
          .filter((i) => !removals.includes(i.id))
          .map((i) => {
            return updatedKeys.includes(i.id)
              ? (updatedDocs.find((f) => f.id === i.id) as IProseModel)
              : i;
          });

  await writeCacheFile(cacheFile, docs);

  return { docs, changes: sm.hasDeltaInfo ? sm.changes : undefined, force, cacheFile };
}
