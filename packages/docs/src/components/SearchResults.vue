<script setup lang="ts">
const props = defineProps({
  query: {type: String, default: ""}
});
import { useSearch } from "~/modules/search";
const s = useSearch();
</script>

<template>
<div class="search-stats flex flex-col rounded-md h-full">

  <div class="rounded-t-md overflow-hidden">
    <div class="font-bold text-lg rounded-t-md bg-gray-900/10 dark:bg-gray-100/10 py-3 px-4">
      Results
    </div>
  </div>

  <div v-if="s.searchResults.length >0 && s.searchStatus ==='ready'" class="p-4 mb-2 space-y-2">
    <search-hit v-for="hit in s.searchResults" :key="hit.id" :document="hit"  />
  </div>
  <div v-else class="flex flex-col flex-grow justify-center italic">
    <div v-if="query.length > 0" >
      no results
    </div>
    <div v-else>
      add a search query above
    </div>
  </div>
</div>
</template>