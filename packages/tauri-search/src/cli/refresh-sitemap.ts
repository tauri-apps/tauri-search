/* eslint-disable no-console */


import { refreshSitemap } from "~/pipelines/refreshSitemap";
import { flattenSitemap, sitemapDictionary } from "~/utils/convertSitemap";
import { CacheKind, getCache } from "~/utils/getCache";
import { getEnv } from "~/utils/getEnv";
import { writeGeneratedFile } from "~/utils/writeGeneratedFile";

(async () => {
  const { repo, branch} = getEnv();
  const filename = `src/generated/sitemap-${repo}-${branch}.json`;
  const existingSitemap = sitemapDictionary(await getCache(CacheKind.sitemap));
  const existingFlatmap = flattenSitemap(await getCache(CacheKind.sitemap));

  console.log(`- refreshing prose sitemap for ${repo}@${branch}${existingSitemap ? `; using existing sitemap for deltas [${existingFlatmap?.length} docs]` : ""}`);

  const sitemap = await refreshSitemap({ ref: branch, repo });
  const contents = flattenSitemap( sitemap);
  const changed: string[] = [];
  const added: string[] = [];
  const removed: string[] = [];

  if(existingSitemap) {
    for (const doc of contents) {

      if(existingSitemap[doc.filepath as any].sha && existingSitemap[doc.filepath as any].sha !== doc.sha) {
        changed.push(doc.filepath);
      } else if (!existingSitemap[doc.filepath as any]?.filepath && doc.sha !== existingSitemap[doc.filepath as any]?.sha ) {
        added.push(doc.filepath);
      }
    }
  }
  if(existingFlatmap) {
    for (const doc of existingFlatmap) {
      if(!contents[doc.filepath as any]) {
        removed.push(doc.filepath);
      }
    }
  }

  console.log(`- updated sitemap has ${contents.length} documents`);
  if(existingSitemap) {
    if(added.length > 0) {
      console.log(`- ${added.length} files added since last check: `);
    }
    if(changed.length > 0) {
      console.log(`- ${changed.length} files changed since last check: ${changed.join(", ")}`);
    }
    if(removed.length > 0) {
      console.log(`- ${removed.length} files added since last check: ${removed.join(", ")}`);
    }
    if([added, changed,removed].every(i => i.length === 0)) {
      console.log(`- no files changed since the last check`);
    }
  }
  
  await writeGeneratedFile(
    filename,
    JSON.stringify(sitemap)
  );

  console.log(`- files saved to: ${filename}`);
  
})();
