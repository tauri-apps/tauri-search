/* eslint-disable no-console */
import { createIndexes } from "~/pipelines/createIndexes";

(async () => {
  try {
    const { skipping, created } = await createIndexes();
    if (skipping.length > 0) {
      console.log(
        `- the following indexes -- ${skipping.join(
          ", "
        )} -- were already setup so skipping`
      );
    }
    if (created.length === 0) {
      console.log(`- it appears there were no other indexes to start`);
    } else {
      console.log(`- created indexes for: ${created.join(", ")}`);
    }
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
})();
