<script setup lang="ts">
const props = defineProps({
  title: { type: String, required: true },
  kind: { type: String, required: true },
  /** the link URL */
  url: { type: String, required: true },
  /** prose description */
  description: { type: String, required: false },
  /** any other properties that don't fit above */
  rest: { type: Object, required: false },
})
</script>

<template>
  <div class="grid rounded bg-gray-50 dark: bg-gray-800 p-8">
    <!--  -->
  </div>
</template>
