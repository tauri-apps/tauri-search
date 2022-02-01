import { readFile } from "fs/promises";
import { beforeAll, describe, expect, it } from "vitest";
import { flattenSitemap, sitemapDictionary } from "~/utils/convertSitemap";
import { IDocsSitemap } from "~/pipelines/buildDocsSitemap";

let sitemap: IDocsSitemap;

describe("flattenSitemap()", () => {
  beforeAll(async () => {
    sitemap = JSON.parse(
      await readFile("test/fixtures/sitemap-tauri-dev.json", "utf-8")
    ) as IDocsSitemap;
  });
  it("flattening works as expected", async () => {
    const flat = flattenSitemap(sitemap);
    expect(Array.isArray(flat)).toBeTruthy();
    for (const file of flat) {
      expect(file).toHaveProperty("filepath");
      expect(file).toHaveProperty("sha");
      expect(file).toHaveProperty("size");
      expect(file).toHaveProperty("download_url");
    }
  });

  it("convert to dictionary", () => {
    const arr = flattenSitemap(sitemap);
    const dict = sitemapDictionary(sitemap);

    expect(typeof dict).toBe("object");
    expect(Object.keys(dict).length).toEqual(arr.length);
    for (const key of arr.map((i) => i.filepath)) {
      const file = dict[key];
      expect(file).toHaveProperty("sha");
      expect(file).toHaveProperty("size");
      expect(file).toHaveProperty("download_url");
    }
  });
});
