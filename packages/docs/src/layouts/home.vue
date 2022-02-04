
<template>
  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200 flex items-center justify-center">
    <div class="flex max-w-4xl">
      <router-view />
    </div>
    <div class="flex flex-col fixed bottom-0 p-4 w-full">
      <Footer />
      <div class="mt-5 mx-auto text-center opacity-25 text-sm">
        <a href="https://tauri.studio">Tauri Apps - Search for Website</a>
      </div>
    </div>
  </main>
</template>
