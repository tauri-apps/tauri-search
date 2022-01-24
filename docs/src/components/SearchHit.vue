<script setup lang="ts">
import { PropType } from "vue";
import { GenericDoc } from "~/types/meilisearch";

const props = defineProps({
  document: {
    type: Object as PropType<GenericDoc>, required: true}
});

const doc = computed(() => props.document);
const showDetails = ref(false);

const apiKind = computed(() => {
  if(doc.value._idx !== "api") {
    return "";
  }
  switch(doc.value.kind) {
    case "Function":
      return "fn";
    case "Namespace":
      return "module";
    case "Interface":
      return "interface";
    default:
      return doc.value?.kind ? String(doc.value?.kind).toLowerCase() : "";
  }
});

const details = () => {
  showDetails.value = !showDetails.value;
};

</script>

<template>
<div class="flex flex-col border-1 rounded px-2 py-1 border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 ">
  <div class="flex flex-row space-x-1 items-center place-content-center cursor-pointer" @click="details">
    <mdi:github v-if="doc._idx === 'repo'" class="flex flex-shrink-0" />
    <vscode-icons:file-type-typescript-official v-if="doc._idx === 'api' && doc.language === 'typescript'" class="flex  flex-shrink-0" />
    <vscode-icons:file-type-rust v-if="doc._idx === 'api' && doc.language === 'rust'" class="flex" />
    <ant-design:file-markdown-outlined v-if="doc._idx === 'prose'"  class="flex" />
    <div class="flex flex-shrink-0">{{doc.name}}</div>
  
    <div class="flex flex-grow ml-1 font-light text-xs italic truncate">
      {{doc.description}}
    </div>

    <div v-if="doc._idx === 'api'" class="flex text-xs font-medium px-1 py-0.5 bg-blue-500 dark:bg-blue-600 text-gray-50 rounded">
      {{apiKind}}
    </div>
    <div class="flex px-1 hover:text-green-600 hover:font-bold ">
      <a :href="doc.url" target="_new">
        <ph:link-light class="flex" />
      </a>
    </div>
  
  
  </div>
    <div v-if="showDetails" class="items-start">
      <div v-for="key in Object.keys(doc)" :key="key" class="flex flex-row">
        <span class="flex font-bold">{{key}}:</span>
        <span class="flex ml-1">{{doc[key]}}</span>
      </div>
    </div>
</div>
</template>