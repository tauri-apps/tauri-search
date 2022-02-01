<script setup lang="ts">
import { useSearch } from "~/modules/search";
const props = defineProps({
  query: {type: String, default: ""}
});
const s = useSearch();
</script>

<template>
<div class="search-stats flex flex-col rounded-md h-full min-h-128">

  <div class="rounded-t-md overflow-hidden">
    <div class="grid grid-cols-3 rounded-t-md bg-gray-900/10 dark:bg-gray-100/10 py-3 px-4 ">
      <div class="block text-sm font-light place-self-start self-center">
        {{s.$state.searchUsing.length}} <span class="italic">index(s) searched</span>
      </div>
      <div class="block font-bold text-lg place-self-center self-center">
        Results
      </div>
      <div class="block text-sm font-light place-self-end self-center">
        {{s.$state.searchResults.length}} <span class="italic">docs found</span>
      </div>
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