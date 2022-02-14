<script setup lang="ts">
import { isDark, toggleDark } from "~/composables";
import { SearchBar } from "meili-searchbar";

const { t, availableLocales, locale } = useI18n();

const config = {
    hostUrl: "http://localhost:7700",
    apiKey: undefined,
    index: "consolidated",
    primaryKey: "objectID",
    debug: true,
  };

const toggleLocales = () => {
  // change to some real logic
  const locales = availableLocales;
  locale.value = locales[(locales.indexOf(locale.value) + 1) % locales.length];
};
</script>

<template>
  <nav class="text-xl my-2 flex flex-row items-center justify-center space-x-2">
    <v-tooltip :delay="{ show: 500, hide: 100 }">
      <router-link class=" icon-btn " to="/" :title="t('button.home')">
        <mdi:folder-home />
      </router-link>
      <template #popper>
        Docs Home
      </template>
    </v-tooltip>

    <v-tooltip :delay="{ show: 500, hide: 100 }">
      <router-link class=" icon-btn " to="/search" :title="t('button.home')">
        <bx:bx-search-alt />
      </router-link>
      <template #popper>
        Interactive Playground
      </template>
    </v-tooltip>

    <div class="px-4 text-gray-200/50 dark:text-gray-300/50 text-light ">
      |
    </div>

    <v-tooltip :delay="{ show: 500, hide: 100 }">
      <router-link class=" icon-btn " to="/meilisearch" :title="t('nav.indexing')">
        <fluent:database-search-24-regular />
      </router-link>
      <template #popper>
        MeiliSearch Info
      </template>
    </v-tooltip>

    <v-tooltip :delay="{ show: 500, hide: 100 }">
      <router-link class=" icon-btn " to="/scraper" :title="t('nav.indexing')">
        <tabler:database-import />
      </router-link>
      <template #popper>
        Scraper
      </template>
    </v-tooltip>

    <v-tooltip :delay="{ show: 500, hide: 100 }">
      <router-link class=" icon-btn " to="/docs-searchbar" :title="t('nav.indexing')">
        <carbon:list-dropdown />
      </router-link>
      <template #popper>
        Search Bar
      </template>
    </v-tooltip>

    <v-tooltip :delay="{ show: 500, hide: 100 }">
      <router-link class=" icon-btn " to="/docker" :title="t('button.about')">
        <teenyicons:docker-outline />
      </router-link>
      <template #popper>
        local Docker search server
      </template>
    </v-tooltip>

    <div class="px-4 text-gray-200/50 dark:text-gray-300/50 text-light ">
      |
    </div>

    <v-tooltip :delay="{ show: 500, hide: 100 }">
      <router-link class="icon-btn " to="/ts-docs">
        <mdi:language-typescript />
      </router-link>
      <template #popper>
        Typescript API Documentation
      </template>
    </v-tooltip>

    <v-tooltip :delay="{ show: 500, hide: 100 }">
      <router-link class="icon-btn " to="/rust-docs">
        <mdi:language-rust />
      </router-link>
      <template #popper>
        Rust API Documentation
      </template>
    </v-tooltip>

    <v-tooltip :delay="{ show: 500, hide: 100 }">
      <router-link class="icon-btn " to="/rust-docs">
        <carbon:document />
      </router-link>
      <template #popper>
        Markdown API Documentation
      </template>
    </v-tooltip>

    <div class="px-4 text-gray-200/50 dark:text-gray-300/50 text-light ">
      |
    </div>

    <v-tooltip :delay="{ show: 500, hide: 100 }">
      <button class=" icon-btn  !outline-none" :title="t('nav.toggle_dark')" @click="toggleDark()">
        <carbon-moon v-if="isDark" />
        <carbon-sun v-else />
      </button>
      <template #popper>
        Toggle light and dark mode
      </template>
    </v-tooltip>

    <v-tooltip :delay="{ show: 500, hide: 100 }">
      <a class=" icon-btn mx-2" :title="t('nav.toggle_langs')" @click="toggleLocales">
        <carbon-language />
      </a>
      <template #popper>
        Switch Language for Heading Content
      </template>
    </v-tooltip>

    <div class="px-4 text-gray-200/50 dark:text-gray-300/50 text-light ">
      |
    </div>

    <search-bar :config="config" class="w-64 max-w-64" />
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
