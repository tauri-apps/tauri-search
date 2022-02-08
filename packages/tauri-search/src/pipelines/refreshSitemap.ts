import { join } from "path";
import { GithubContentsResp, IEnv } from "~/types";
import { flattenSitemap, IFlatSitemap, sitemapDictionary } from "~/utils/convertSitemap";
import { CacheKind, getCache } from "~/utils/getCache";
import { getEnv } from "~/utils/getEnv/esm/getEnv";
import { getDirectory } from "~/utils/github/getDirectory";
import { writeCacheFile } from "~/utils/writeCacheFile";

export interface IDocsSitemapFile {
  name: string;
  size: number;
  sha: string;
  download_url: string;
}

export interface IDocsSitemap {
  dir: string;
  files: IDocsSitemapFile[];
  children: IDocsSitemap[];
}

/**
 * A type utiility which adds delta-context to a recently created sitemap
 */
export type Sitemap<T extends IDocsSitemap> = {
  hasDeltaInfo: boolean;
  cacheFile: string;
  sitemap: T;
  count: number;
  changes: {
    added: string[];
    changed: string[];
    removed: string[];
  };
};

/**
 * reduces the Github output to just core properties
 */
function reduceClutter(
  dir: string,
  resp: GithubContentsResp
): [files: IDocsSitemap["files"], children: string[]] {
  if (!Array.isArray(resp)) {
    resp = [resp];
  }
  const files: IDocsSitemap["files"] = resp
    .filter((i) => i.type === "file" && i.name.endsWith(".md"))
    .map((f) => ({
      name: f.name,
      size: f.size,
      sha: f.sha,
      download_url: f.download_url as string,
    }));

  const children = resp
    .filter((i) => i.type === "dir" && !i.name.startsWith(".") && i.name !== "api")
    .map((d) => d.name);

  return [files, children];
}

async function getStructure(o: IEnv) {
  // RECURSE INTO REPO STARTING at PATH
  const [files, children] = reduceClutter(o.docsPath, (await getDirectory(o)).data);

  const sitemap: IDocsSitemap = {
    dir: o.docsPath,
    files,
    children: [],
  };

  if (children.length > 0) {
    const waitFor: Promise<IDocsSitemap>[] = [];
    for (const child of children) {
      if (child.startsWith("_" || child.startsWith(".") || child === "api")) {
        // eslint-disable-next-line no-console
        console.log(
          `- skipping the "${child}" directory due to leading directory character`
        );
      } else {
        const p = join(o.docsPath, `/${child}`);
        const mo: IEnv = { ...o, docsPath: p };
        waitFor.push(getStructure(mo));
      }
    }
    const resolved = await Promise.all(waitFor);
    sitemap.children = resolved;
  }

  return sitemap;
}

/**
 * Uses Github API to build a sitemap of markdown files for a given repo.
 *
 * Note: if a sitemap already exists, it will compare the hash values from
 * the cached sitemap and return `added`, `removed`, and `changed` arrays
 * to help downstream consumers only update what is necessary.
 */
export async function refreshSitemap(
  options: Partial<IEnv> = {}
): Promise<Sitemap<IDocsSitemap>> {
  const o = { ...getEnv(), ...options };
  const sitemap = await getStructure(o);
  /** flattened version just created sitemap */
  const flatSitemap = flattenSitemap(sitemap) as IFlatSitemap[];

  const { cacheFile, cache } = await getCache(CacheKind.sitemap);

  const existingSitemap = sitemapDictionary(cache);
  const existingFlatmap = flattenSitemap(cache);

  // DELTAs
  const changed: string[] = [];
  const added: string[] = [];
  const removed: string[] = [];

  if (existingSitemap) {
    for (const doc of flatSitemap) {
      if (
        existingSitemap[doc.filepath as any]?.sha &&
        existingSitemap[doc.filepath as any]?.sha !== doc?.sha
      ) {
        changed.push(doc.filepath);
      } else if (
        !existingSitemap[doc.filepath as any]?.filepath &&
        doc?.sha !== existingSitemap[doc.filepath as any]?.sha
      ) {
        added.push(doc.filepath);
      }
    }
  }

  if (existingFlatmap) {
    const newSitemap = sitemapDictionary(sitemap);

    for (const doc of existingFlatmap) {
      if (!newSitemap[doc.filepath as any]) {
        removed.push(doc.filepath);
      }
    }
  }

  // write new sitemap
  await writeCacheFile(cacheFile, sitemap);

  return {
    sitemap,
    hasDeltaInfo: existingFlatmap ? true : false,
    changes: { added, changed, removed },
    count: flatSitemap?.length || 0,
    cacheFile: cacheFile,
  };
}
