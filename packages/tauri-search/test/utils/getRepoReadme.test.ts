import { describe, expect, it } from "vitest";
import { getRepoReadme } from "~/utils/github/getRepoReadme";

describe("getRepoReadme.test.ts", () => {
  it("repo with readme returns text", async () => {
    const content = await getRepoReadme("tauri-apps/tauri");
    expect(content).not.toBeUndefined();
  });

  it("repo without a readme returns undefined", async () => {
    const content = await getRepoReadme("tauri-apps/tauri-plugin-websocket");
    expect(content).toBeUndefined();
  });
});
