import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { LinkExists, linkExists, LinkMissing } from "../tools/linkExists";
import { beforeAll, describe, expect, it } from "vitest";
import { REPO_DOCS_CACHE, TS_DOCS_CACHE } from "~/constants";
import { ConsolidatedMapper } from "~/mappers/ConsolidatedMapper";
import { IApiModel, IProseModel, IRepoModel } from "~/models";
import {
  proseDocsCacheFile,
  refreshProse,
  refreshRepos,
  refreshTypescript,
} from "~/pipelines";
import { getEnv } from "~/utils/getEnv";
const { repo, branch } = getEnv();

describe("link testing of consolidated index", () => {
  // let docs: IConsolidatedModel[];
  beforeAll(async () => {
    if (!existsSync(TS_DOCS_CACHE)) {
      await refreshTypescript(repo, branch);
    }
    if (!existsSync(REPO_DOCS_CACHE)) {
      await refreshRepos();
    }
    if (!existsSync(proseDocsCacheFile(repo, branch))) {
      await refreshProse(repo, branch);
    }
  });

  it("test links originating from prose", async () => {
    const docs = (
      JSON.parse(
        await readFile(proseDocsCacheFile(repo, branch), "utf-8")
      ) as IProseModel[]
    ).map((i) => ConsolidatedMapper(i));
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
    const docs = (JSON.parse(await readFile(TS_DOCS_CACHE, "utf-8")) as IApiModel[]).map(
      (i) => ConsolidatedMapper(i)
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
    const docs = (
      JSON.parse(await readFile(REPO_DOCS_CACHE, "utf-8")) as IRepoModel[]
    ).map((i) => ConsolidatedMapper(i));
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
