/* eslint-disable no-console */
import { ApiModel } from "~/models";
import { getEnv } from "~/utils/getEnv/node/getEnv";

(async () => {
  const o = getEnv();

  const active = (
    await ApiModel(o.stage, { admin_key: o.adminKey }).query.currentIndexes()
  ).map((i) => i.name);
  console.log(`- clearing all active indexes: ${active.join(", ")}`);
  for (const idx of active) {
    await ApiModel(o.stage, { admin_key: o.adminKey }).query.deleteIndex(idx);
  }
})();
