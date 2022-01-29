import { describe, expect, it } from "vitest";
import { refreshRepos } from "~/utils/refreshRepos";

describe("refreshRepos()", () => {
  it("running refreshRepos() generates valid documents.json file", async () => {
    await refreshRepos();
  });
});
