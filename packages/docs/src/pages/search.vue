<script setup lang="ts">
import { onStartTyping } from "@vueuse/core";
import { useSearch } from "~/modules/search";
const el = ref();
const searchText = ref("");
const s = useSearch();
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
  <div class="py-3 w-full h-full">
    <h1 class="text-xl mb-4">
      MeiliSearch Playground
    </h1>
    
    <input
      id="input"
      ref="el"
      v-model="searchText"
      :placeholder="t('home.ask-for-search')"
      :aria-label="t('home.ask-for-search')"
      type="text"
      autocomplete="false"
      spellcheck="false"
      class="px-auto px-4 py-3 w-350px text-center bg-transparent self-center"
      border="~ rounded gray-200 dark:gray-700"
      outline="none active:none"
    >
    <label class="hidden" for="input">{{ t('home.ask-for-search') }}</label>

    <div class="results-area grid grid-cols-3 gap-4 h-full mt-8 mx-4">
      <div class="flex flex-col col-span-1 space-y-4">
        <search-indexes class="" />
      </div>

      <div class="col-span-2 rounded-md bg-gray-100/25 dark:bg-gray-900/25">
        <search-results :query="searchText" />
      </div>
    </div>
  </div>
</template>
