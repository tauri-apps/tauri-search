/* eslint-disable no-console */
import { ApiModel } from "~/models";

(async () => {
  const active = (await ApiModel.query.currentIndexes()).map((i) => i.name);
  console.log(`- clearing all active indexes: ${active.join(", ")}`);
  for (const idx of active) {
    await ApiModel.query.deleteIndex(idx);
  }
})();
