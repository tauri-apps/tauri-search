<script setup lang="ts">
import { useSearch } from "~/modules/search";
const s = useSearch();
</script>

<template>
<div class="search-stats flex flex-col rounded-md bg-gray-100/25 dark:bg-gray-800/25">

  <div class="rounded-t-md overflow-hidden">
    <div class="font-bold text-lg rounded-t-md bg-gray-900/10 dark:bg-gray-100/10  py-3 px-4">
      INDEXES
    </div>
  </div>

  <div v-if="s.$state.health" class="text-xs mt-2" >
    <div class="text-green-500">MeiliSearch Service Healthy!</div>
  <div class="db-size">db size: {{s.dbSize}}</div>
  </div>
  <span v-else class="text-red-500 ">
    Meilisearch is not available locally!
  </span>
  <div class="p-4">
    <div
      v-for="idx in s.$state.indexes"
      :key="idx.uid"
      class="index flex flex-row w-full py-2 border-1 rounded border-gray-500 p-4 mt-4"
    >
      <span class="index-name flex flex-grow font-medium">{{idx.name}}</span>
      <v-tooltip >
        <span class="index-name font-light cursor-pointer">
          {{s.indexInfo(idx.name)?.numberOfDocuments}}
        </span>
        <template #popper>
          <span class="dark:text-gray-300">
            # of Docs
          </span>
        </template>
      </v-tooltip>
    </div>
  </div>
</div>
</template>