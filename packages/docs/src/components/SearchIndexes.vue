<script setup lang="ts">
import { useSearch } from "~/modules/search";
const search = useSearch();

/**
 * this allows all expected indexes to be shown and in a sensible order
 */
const knownIndexes = ["api", "prose", "repo", "consolidated"];
/** the name of the indexes current known by MeiliSearch */
const currentIndexes = computed(() => search.$state.indexes.map(i => i.name));

/**
 * we do want to see ANY index that exists though too
 */
const unknownIndexes = computed(() => {
  return search.$state.indexes.filter(i => !knownIndexes.includes(i.name));
});

</script>

<template>
<div class="search-indexes flex flex-col flex-grow rounded-md bg-gray-100/25 dark:bg-gray-800/25">

  <div class="rounded-t-md overflow-hidden">
    <div class="font-bold text-lg rounded-t-md bg-gray-900/10 dark:bg-gray-100/10  py-3 px-4">
      INDEXES
    </div>
  </div>

  <div v-if="search.$state.health" class="text-xs mt-2" >
    <div class="text-green-500">MeiliSearch Service Healthy!</div>
  <div class="db-size">db size: {{search.dbSize}}</div>
  </div>
  <span v-else class="text-red-500 ">
    Meilisearch is not available locally!
  </span>

  <div class="index-list p-4 w-full flex flex-col  ">
    <template v-for="idx in knownIndexes" :key="idx">
    <current-index v-if="currentIndexes.includes(idx)" :idx="search.$state.indexes.find(i => i.name === idx)"/>
    <missing-index v-else :idx="idx" />
    </template>
    <template v-for="idx in unknownIndexes" :key="idx">
    <current-index :idx="idx" :unknown="true" />
    </template>


  </div>
</div>
</template>