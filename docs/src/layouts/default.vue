<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <main class="text-center text-gray-700 dark:text-gray-200 flex items-center justify-center flex-col ">
    <!-- HEADER -->
    <div class="flex flex-col justify-center bg-blue-900 text-gray-100 dark:bg-blue-800/50 w-full space-y-4 align-middle items-center justify-center py-2">
      <div class="flex flex-col ">
        <div class="text-2xl font-semibold">
          <a rel="noreferrer" href="https://tauri.studio" target="_blank">Tauri {{ t("home.search") }}</a>
        </div>
        <div><em class="text-sm opacity-75">{{ t('home.desc') }}</em></div>
      </div>
    </div>
    <!-- NAV -->
    <div class="bg-blue-800 text-gray-100 dark:bg-blue-700/50 w-full mb-4">
      <Footer />
    </div>

    <!-- MAIN CONTENt -->
    <div class="flex max-w-4xl h-auto min-h-full dark:bg-black/25 p-4 rounded-lg w-4xl">
      <router-view />
    </div>
  </main>
</template>
