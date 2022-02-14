import { omit } from "native-dash";
import { join } from "path";
import { IDocsSitemap } from "~/pipelines/refreshSitemap";

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
export function flattenSitemap<S extends IDocsSitemap | undefined>(
  sm: S
): S extends IDocsSitemap ? IFlatSitemap[] : undefined {
  let flat: IFlatSitemap[] = [];
  if (!sm) {
    return undefined as S extends IDocsSitemap ? IFlatSitemap[] : undefined;
  } else {
    for (const f of sm?.files || []) {
      const filepath = join(sm.dir, f.name);
      flat.push({ filepath, sha: f.sha, size: f.size, download_url: f.download_url });
    }
    if (sm.children && sm.children.length > 0) {
      for (const child of sm.children) {
        flat = flat.concat(...flattenSitemap(child));
      }
    }
  }
  return flat as S extends IDocsSitemap ? IFlatSitemap[] : undefined;
}

export function sitemapDictionary<S extends IDocsSitemap | undefined>(sm: S) {
  return (
    sm
      ? flattenSitemap(sm as IDocsSitemap).reduce((acc, i) => {
          return { ...acc, [i.filepath]: { ...omit(i, "filepath") } };
        }, {} as ISitemapDictionary)
      : undefined
  ) as S extends IDocsSitemap ? IFlatSitemap[] : undefined;
}
