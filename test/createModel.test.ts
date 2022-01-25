import { createModel } from "~/utils/createModel";

type Model = {
  title: string;
  section: string;
  lastUpdated: number;
};

type AstModel = {
  h1: string;
  h2: string;
  lastUpdated: string;
};

describe("createModel()", () => {
  it("Configuring index properties on a model is seen in model's info section", async () => {
    const m = createModel<Model>("foobar", (m) =>
      m //
        .sortable("section")
        .displayed("title", "section")
        .filterable("lastUpdated")
    );

    expect(m.meta.displayed).toContain("title");
    expect(m.meta.displayed).toContain("section");
    expect(m.meta.displayed).not.toContain("lastUpdated");

    expect(m.meta.sortable).toContain("section");
    expect(m.meta.filterable).toContain("lastUpdated");
  });

  it("toString() produces a clear and concise indication of what model it is", async () => {
    const m = createModel<Model>("foobar");
    expect(m.toString()).toContain("Model");
    expect(m.toString()).toContain("foobar::");
    expect(m.toString()).toContain(String(m.meta.hash));
  });

  it("adding mappers to a model, exposes this on the model API", () => {
    // define a mapper on `m`
    const m = createModel<Model>("foobar", (c) =>
      c //
        .addMapper("doc")
        .mapDefn<AstModel>((i) => ({
          title: i.h1,
          section: i.h2,
          lastUpdated: new Date(i.lastUpdated).getTime(),
        }))
        .searchable("title", "section")
    );
  });
});
