<script setup lang="ts">
import { onStartTyping } from "@vueuse/core";
import { useSearch } from "~/modules/search";
const el = ref();
const s = useSearch();
const searchText = ref(s.$state.searchQuery);
const { t } = useI18n();

debouncedWatch(
  searchText,
  async() => {
    await s.search(searchText.value);
  },
  { debounce: 500 }
);

onStartTyping(() => {
  if (!el.value.active) {el.value.focus();};
});


</script>

<template>
  <div class="w-full h-full">
    <h1 class="text-xl mb-4">
      MeiliSearch Playground
    </h1>
    <div class="grid grid-cols-3 gap-x-4">
      <div class="left flex flex-grow items-center justify-center">
        <div class="flex flex-row space-x-2">
          <!--  -->
        </div>
      </div>

      <div class="centered">
        <input
          id="input"
          ref="el"
          v-model="searchText"
          :placeholder="t('home.ask-for-search')"
          :aria-label="t('home.ask-for-search')"
          type="text"
          autocomplete="false"
          spellcheck="false"
          class="px-auto px-4 py-4 w-350px text-center bg-transparent self-center dark:focus:placeholder-gray-700 focus:placeholder-gray-300"
          border="~ rounded gray-200 dark:gray-700"
          outline="none active:none"
        >
        <label class="hidden" for="input">{{ t('home.ask-for-search') }}</label>
      </div>
      
      <div class="right flex flex-col items-center p-1 rounded">
        
      </div>

    </div>
    

    <div class="results-area grid grid-cols-3 gap-4 h-full mt-8 mx-4">
      <div class="flex flex-col col-span-1 space-y-4">
        <search-indexes class="" />
      </div>

      <div class="col-span-2 rounded-md">
        <search-results :query="searchText" />
      </div>
    </div>

  </div>
</template>
