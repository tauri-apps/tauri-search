<script setup lang="ts">
import { onStartTyping, useIntervalFn } from '@vueuse/core'
const el = ref()
const searchText = ref('')

onStartTyping(() => {
  if (!el.value.active)
    el.value.focus()
})

const searchAvailable = ref(false)

useIntervalFn(async() => {
  const response = await (await fetch('http://localhost:7700/health')).json() as { status: string }
  searchAvailable.value = response.status === 'available'
}, 5000)

const router = useRouter()
const search = async() => {
  const response = await (await fetch(`http://localhost:7700/indexes/repo/search?q=${searchText.value}`)).json()
}

const { t } = useI18n()
</script>

<template>
  <div class="py-8 w-full flex flex-col space-y-4">
    <div class="text-xl">
      Use the local Meilisearch here.
    </div>
    <div class="text-xs" :class="searchAvailable ? 'text-green-500' : 'text-red-500'">
      <span v-if="searchAvailable">Meilisearch Found Locally!</span>
      <span v-else>Meilisearch is not available locally!</span>
    </div>
    <input
      id="input"
      ref="el"
      v-model="searchText"
      :placeholder="t('home.ask-for-search')"
      :aria-label="t('home.ask-for-search')"
      type="text"
      autocomplete="false"
      class="px-auto px-4 py-2 w-250px text-center bg-transparent self-center"
      border="~ rounded gray-200 dark:gray-700"
      outline="none active:none"
      @keydown.enter="search"
    >
    <label class="hidden" for="input">{{ t('home.ask-for-search') }}</label>

    <div>
      <button
        class="m-3 text-sm btn"
        :disabled="!searchText"
        @click="search"
      >
        {{ t('button.go') }}
      </button>
    </div>

    <div class="results-area flex flex-col flex-grow">
      results
    </div>
  </div>
</template>
