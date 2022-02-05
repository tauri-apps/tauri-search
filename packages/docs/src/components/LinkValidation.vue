<script setup lang="ts">
import { useFetch } from "@vueuse/core";
const props = defineProps({
  url: {type: String, required: true}
});

const proxiedUrl = computed(() => props.url.replace("https://tauri.studio", "/tauri").replace("https://github.com", "/github") + "/");

const {execute, data, isFetching, statusCode, isFinished } = useFetch(proxiedUrl.value, {method: "HEAD"}, {refetch: false, immediate: false});


setTimeout(() => {
    execute().catch(_err => {}); // wait up to 500ms before requesting to space give breathing room for render and other requests
}, Math.floor(Math.random()*500));

const statusColor = computed(() => {
  return isFetching.value ? "bg-grey-500" : isFinished.value && statusCode.value  && statusCode.value< 300 ? "bg-green-500" : isFinished.value ? "bg-red-500" : "bg-orange-500";
});

</script>

<template>
<div class="flex flex-row px-1 hover:text-green-600 hover:font-bold relative">
  <v-tooltip>
    <a :href="(props.url as string)" target="_new" class="flex flex-row space-x-0.5">
      <ph:link-light class="flex mr-1" />
    </a>
    <template #popper>
      <span class="font-light italic">The URL for the search document is:</span><br>
      {{props.url}}
    </template>
  </v-tooltip>
  <div class="link-validation absolute top-0.25 opacity-75 right-0" :data-code="statusCode" :data-info="data" >
    <div class="rounded-full w-2 h-2 " :class="statusColor" ></div>
  </div>
</div>


</template>

