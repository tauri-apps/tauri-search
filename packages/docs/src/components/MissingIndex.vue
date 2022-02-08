<script setup lang="ts">
import { ApiModel, ConsolidatedModel, ProseModel, RepoModel } from "tauri-search";
import { PropType } from "vue";
const props = defineProps({
  idx: {type: String as PropType<"api" | "prose" | "repo" | "consolidated">, required: true}
});
const models = {
  api: ApiModel(),
  prose: ProseModel(),
  repo: RepoModel(),
  consolidated: ConsolidatedModel()
};

async function addIndex() {
  const model = models[props.idx];
  await model.query.createIndex();
}
</script>

<template>
<v-tooltip class="w-full" placement="right" :delay="8000">
  <div
      class="index flex flex-row w-full py-2 px-3 border-1 rounded border-dashed border-gray-300 dark:border-gray-700 mt-4 cursor-default"
    >
    <span class="index-name flex flex-grow font-medium">{{idx}}</span>
    <span class="index-count flex flex-grow-0 font-light cursor-pointer items-baseline">
      <v-tooltip :delay="750" placement="right">
      <button class="text-xs italic px-2 py-1 bg-gray-300/75 hover:bg-green-300/75 dark:hover:bg-green-700/75 dark:bg-gray-700/75 rounded-md" @click="addIndex">add index</button>
      <template #popper>will create an empty index for "{{idx}}"</template>
      </v-tooltip>
    </span>

  </div>
<template #popper>
  The <span class="tag">{{idx}}</span> index is defined as a MODEL but doesn't yet exist in MeiliSearch as an index.
</template>
</v-tooltip>
</template>

