/* eslint-disable no-console */
import { ApiModel } from "..";

(async () => {
  try {
    const result = await ApiModel().query.currentIndexes();
    console.log(`MeiliSearch currently has the following indexes:\n`);
    for (const r of result) {
      console.log(`  > ${r.name} - created at ${r.createdAt}`);
    }
    console.log();
  } catch (err) {
    console.log(`Failed to get the list of indexes on MeiliSearch`);
    console.error(err);
    process.exit(1);
  }
})();
