import { ApiModel } from "../../dist";

async () => {
  const active = (await ApiModel.query.currentIndexes()).map((i) => i.name);
  console.log(`- clearing all active indexes: ${active.join(", ")}`);
  for (const idx of active) {
    ApiModel.query.deleteIndex(idx);
  }
};
