import { LinkExists, linkExists, LinkMissing } from "../tools/linkExists";
import { beforeAll, describe, expect, it } from "vitest";
import { ConsolidatedMapper } from "~/mappers/ConsolidatedMapper";
import { refreshProse, refreshRepos, refreshTypescript } from "~/pipelines";

import { CacheKind, getCache } from "~/utils/getCache";

describe("link testing of consolidated index", () => {
  beforeAll(async () => {
    await refreshTypescript();
    await refreshRepos();
    await refreshProse();
  });

  it("test links originating from prose", async () => {
    const docs = (await getCache(CacheKind.proseDocs)).cache.map((i) =>
      ConsolidatedMapper(i)
    );
    const links: Promise<LinkExists | LinkMissing>[] = [];
    for (const doc of docs) {
      links.push(linkExists(doc.url));
    }
    const results = await Promise.all(links);
    const broken = results.filter((i) => !i.ok);
    expect(
      results.every((i) => i.ok),
      `${broken.length} of ${docs.length} prose links don't seem to exist:\n\t${broken
        .map((i) => `${i.url} -> ${(i as LinkMissing).error}`)
        .join("\n\t")}`
    ).toBeTruthy();
  });
  it("test links originating from Typescript API", async () => {
    const docs = (await getCache(CacheKind.typescriptDocs)).cache.map((i) =>
      ConsolidatedMapper(i)
    );
    const links: Promise<LinkExists | LinkMissing>[] = [];
    for (const doc of docs) {
      links.push(linkExists(doc.url));
    }
    const results = await Promise.all(links);
    const broken = results.filter((i) => !i.ok);
    expect(
      results.every((i) => i.ok),
      `${broken.length} of ${docs.length} prose links don't seem to exist:\n\t${broken
        .map((i) => `${i.url} -> ${(i as LinkMissing).error}`)
        .join("\n\t")}`
    ).toBeTruthy();
  });
  it.todo("test links originating from Rust API", async () => {});
  it("test links originating from repos", async () => {
    const docs = (await getCache(CacheKind.repoDocs)).cache.map((i) =>
      ConsolidatedMapper(i)
    );
    const links: Promise<LinkExists | LinkMissing>[] = [];
    for (const doc of docs) {
      links.push(linkExists(doc.url));
    }
    const results = await Promise.all(links);
    const broken = results.filter((i) => !i.ok);
    expect(
      results.every((i) => i.ok),
      `${broken.length} of ${docs.length} prose links don't seem to exist:\n\t${broken
        .map((i) => `${i.url} -> ${(i as LinkMissing).error}`)
        .join("\n\t")}`
    ).toBeTruthy();
  });
});
