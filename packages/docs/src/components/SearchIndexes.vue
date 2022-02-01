<script setup lang="ts">
import { Keys } from "inferred-types";
import { useSearch } from "~/modules/search";
import type { IMeilisearchInterface} from "tauri-search";
const s = useSearch();

/**
 * this allows all expected indexes to be shown and in a sensible order
 */
const knownIndexes = ["api", "prose", "repo", "consolidated"] as const;
/** the name of the indexes current known by MeiliSearch */
const currentIndexes = computed(() => s.$state.indexes.map(i => i.name));

/**
 * we do want to see ANY index that exists though too
 */
const unknownIndexes = computed(() => {
  return s.$state.indexes.filter(i => !knownIndexes.includes(i.name as Keys<typeof knownIndexes>));
});

const indexStateOptions = ["consolidated", "individual", "bespoke"] as const;
type IndexState = Keys<typeof indexStateOptions>;

const indexState = computed(() => {
  if(s.$state.searchUsing.length === 1 && s.$state.searchUsing[0] === "consolidated") {
      return "consolidated";
  } else if(s.$state.searchUsing.length === 3 && ["api", "prose", "repo"].every(i => s.$state.searchUsing.includes(i))) {
      return "individual";
  } else {
      return "bespoke";
  }
});

const changeIndexes = (opt: IndexState) => {
  switch(opt) {
    case "consolidated":
      s.setUseOfIndexes(["consolidated"]);
      break;
    case "individual":
      s.setUseOfIndexes(["api", "prose", "repo"]);
  }
};

const optionStyle = (opt: IndexState) => computed(() => {
  const isSelected = indexState.value === opt;
  const selected = isSelected ? "opacity-100 border-b-1" : "opacity-50";
  switch(opt) {
    case "bespoke":
      return `${selected} cursor-default`;
    default:
      return isSelected ? `${selected} cursor-default` : `${selected} cursor-pointer`;
  }
});

</script>

<template>
<div class="search-indexes flex flex-col flex-grow rounded-md bg-gray-100/25 dark:bg-gray-800/25 ">

  <div class="rounded-t-md overflow-hidden ">
    <div class="font-bold text-lg rounded-t-md bg-gray-900/10 dark:bg-gray-100/10  py-3 px-4">
      INDEXES
    </div>
  </div>

  <div class="index-list p-4 w-full flex flex-col flex-grow ">
    <div class="index-usage flex flex-col items-center p-1 bg-gray-500/10 rounded mb-4">
      <div>Index Usage</div>

      <div class="flex mt-2 flex-row space-x-3 text-gray-600 dark:text-gray-400 text-sm ">
        <div
          v-for="opt in indexStateOptions"
          :key="opt"
          class="option flex"
          :class="optionStyle(opt).value"
          @click="() => changeIndexes(opt)"
        >
          {{opt}}
        </div>
      </div>
    </div>

    <template v-for="idx in knownIndexes" :key="idx">
      <current-index v-if="currentIndexes.includes(idx)" :idx="((s.indexes.find(i => i.name === idx))as IMeilisearchInterface)"/>
      <missing-index v-else :idx="idx" />
    </template>
    <template v-for="idx in unknownIndexes" :key="idx">
      <current-index :idx="idx" :unknown="true" />
    </template>

      <div class="mt-8">
    <div v-if="s.$state.health" class="text-xs mt-2" >
      <div class="text-green-500">MeiliSearch Service Healthy!</div>
    <div class="db-size">db size: {{s.dbSize}}</div>
    </div>
    <span v-else class="text-red-500 ">
      Meilisearch is not available locally!
    </span>
  </div>

    <div class="flex flex-grow"></div>

    
  </div>
</div>
</template>