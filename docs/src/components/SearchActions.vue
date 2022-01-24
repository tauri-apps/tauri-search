<script setup lang="ts">
import { useSearch } from "~/modules/search";
const s = useSearch();
const indexPossibilites = ["repo", "prose", "TS API", "RS API"];
</script>

<template>
<div class="flex flex-col rounded-md bg-gray-100/25 dark:bg-gray-900/25">
  <div class="flex flex-col space-y-2 rounded-t-md overflow-hidden">

    <div class="font-bold text-lg px-4 py-3 bg-gray-900/10 dark:bg-gray-100/10">
      ACTIONS
    </div>

    <div class="p-4 flex flex-col space-y-2">

      <div v-for="idx in indexPossibilites" :key="idx" class=" rounded cursor-pointer p-1 flex">
        <div class="actions flex flex-row space-x-1 items-center text-gray-100 dark:text-gray-700 transition-colors duration-200">
          <carbon:next-filled class="flex hover:text-green-500" />
          <carbon:error-filled class="flex hover:text-orange-500" />
        </div>

        <div class="flex flex-row ml-2">
          <span class="font-medium">{{idx}}&nbsp;</span>
          <span class="font-light">pipeline</span>
        </div>
      </div>

    </div>
  </div>
</div>
</template>

<style lang="css" scoped>
.btn {
  @apply text-xs ;
}
</style>