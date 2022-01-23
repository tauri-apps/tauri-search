import { createModel } from "~/utils/createModel";
type Model = {
  title: string;
  section: string;
  lastUpdated: number;
};

describe("createModel()", () => {
  it("Configuring index properties on a model is seen in model's info section", async () => {
    const m = await createModel<Model>("foobar", (m) =>
      m //
        .sortable("section")
        .displayed("title", "section")
        .filterable("lastUpdated")
    );

    expect(m.info.displayed).toContain("title");
    expect(m.info.displayed).toContain("section");
    expect(m.info.displayed).not.toContain("lastUpdated");

    expect(m.info.sortable).toContain("section");
    expect(m.info.filterable).toContain("lastUpdated");
  });

  it("toString() produces a clear and concise indication of what model it is", async () => {
    const m = await createModel<Model>("foobar");
    expect(m.toString()).toContain("Model");
    expect(m.toString()).toContain("foobar::");
    expect(m.toString()).toContain(String(m.hash));
  });
});
