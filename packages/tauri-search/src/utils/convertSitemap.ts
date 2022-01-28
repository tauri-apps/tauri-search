import { omit } from "native-dash";
import { join } from "path";
import { IDocsSitemap } from "./github/buildDocsSitemap";

export interface IFlatSitemap {
  /** the full "relative path" (aka, dir and filename combined) */
  filepath: string;
  sha: string;
  size: number;
  download_url: string;
}

export type ISitemapDictionary = Record<string, Omit<IFlatSitemap, "filepath">>;

/**
 * Flattens the hierarchical structure of a sitemap into an easily iterable array
 */
export function flattenSitemap(sm: IDocsSitemap): IFlatSitemap[] {
  let flat: IFlatSitemap[] = [];
  for (const f of sm.files) {
    const filepath = join(sm.dir, f.name);
    flat.push({ filepath, sha: f.sha, size: f.size, download_url: f.download_url });
  }
  if (sm.children && sm.children.length > 0) {
    for (const child of sm.children) {
      flat = flat.concat(...flattenSitemap(child));
    }
  }

  return flat;
}

export function sitemapDictionary(sm: IDocsSitemap) {
  return flattenSitemap(sm).reduce((acc, i) => {
    return { ...acc, [i.filepath]: { ...omit(i, "filepath") } };
  }, {} as ISitemapDictionary);
}
