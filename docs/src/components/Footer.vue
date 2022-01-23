<script setup lang="ts">
import { isDark, toggleDark } from '~/composables'

const { t, availableLocales, locale } = useI18n()

const toggleLocales = () => {
  // change to some real logic
  const locales = availableLocales
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length]
}
</script>

<template>
  <nav class="text-xl my-2 flex flex-row items-center justify-center space-x-2">
    <router-link class=" icon-btn " to="/" :title="t('button.home')">
      <mdi:folder-home />
    </router-link>

    <router-link class=" icon-btn " to="/search" :title="t('button.home')">
      <bx:bx-search-alt />
    </router-link>

    <div class="px-4 text-gray-200/50 dark:text-gray-300/50 text-light ">
      |
    </div>

    <router-link class=" icon-btn " to="/meilisearch" :title="t('nav.indexing')">
      <fluent:database-search-24-regular />
    </router-link>

    <router-link class=" icon-btn " to="/scraper" :title="t('nav.indexing')">
      <tabler:database-import />
    </router-link>

    <router-link class=" icon-btn " to="/docs-searchbar" :title="t('nav.indexing')">
      <ic:round-screen-search-desktop />
    </router-link>

    <router-link class=" icon-btn " to="/docker" :title="t('button.about')">
      <teenyicons:docker-outline />
    </router-link>

    <div class="px-4 text-gray-200/50 dark:text-gray-300/50 text-light ">
      |
    </div>

    <router-link class="icon-btn " to="/ts-docs">
      <mdi:language-typescript />
    </router-link>
    <router-link class="icon-btn " to="/rust-docs">
      <mdi:language-rust />
    </router-link>

    <div class="px-4 text-gray-200/50 dark:text-gray-300/50 text-light ">
      |
    </div>

    <v-tooltip>
      <button class=" icon-btn  !outline-none" :title="t('nav.toggle_dark')" @click="toggleDark()">
        <carbon-moon v-if="isDark" />
        <carbon-sun v-else />
      </button>
      <template #popper>
        Toggle light and dark mode
      </template>
    </v-tooltip>

    <a class=" icon-btn mx-2" :title="t('nav.toggle_langs')" @click="toggleLocales">
      <carbon-language />
    </a>
  </nav>
</template>

<style lang="css" scoped>
.icon-btn {
  @apply flex p-1 rounded rounded-b-none;
}
.router-link-active {
  @apply border-b-3 border-indigo-500 ;
}
</style>
