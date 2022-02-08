import { describe, expect, it } from "vitest";
import { createModel } from "~/utils/createModel";

type Model = {
  title: string;
  section: string;
  lastUpdated: number;
};

describe("createModel()", () => {
  it("Configuring index properties on a model is seen in model's info section", async () => {
    const m = createModel<Model>("foobar", (m) =>
      m //
        .sortable("section")
        .displayed("title", "section")
        .filterable("lastUpdated")
    );

    expect(m().index.displayed).toContain("title");
    expect(m().index.displayed).toContain("section");
    expect(m().index.displayed).not.toContain("lastUpdated");

    expect(m().index.sortable).toContain("section");
    expect(m().index.filterable).toContain("lastUpdated");
  });

  it("toString() produces a clear and concise indication of what model it is", async () => {
    const m = createModel<Model>("foobar");
    expect(m().toString()).toContain("Model");
    expect(m().toString()).toContain("foobar");
  });

  it("model can set ranking rules to any order they like", () => {
    const m = createModel<Model>("foobar", (m) =>
      m.rankingRules((r) => r.attribute().exactness().words())
    );
    expect(
      m().index.rules,
      `the ranking rules were expected to be [attribute, exactness, words] but instead were ${
        m().index.rules
      }`
    ).toEqual(["attribute", "exactness", "words"]);
  });
});
