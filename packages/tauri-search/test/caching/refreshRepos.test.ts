import { existsSync } from "fs";
import { rm } from "fs/promises";
import { describe, expect, it } from "vitest";
import { REPO_DOCS_CACHE } from "~/constants";
import { refreshRepos } from "~/pipelines/refreshRepos";

describe("refreshRepos()", () => {
  // turn on to test but otherwise it consumes a lot of Github calls
  it.skip("running refreshRepos() generates valid documents.json file", async () => {
    try {
      await rm(REPO_DOCS_CACHE);
    } catch {}

    await refreshRepos();
    expect(existsSync(REPO_DOCS_CACHE)).toBeTruthy();
  });
});
