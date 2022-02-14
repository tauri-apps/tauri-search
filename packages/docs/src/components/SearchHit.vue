<script setup lang="ts">
import { PropType } from "vue";
import { GenericDoc } from "tauri-search";
import { useSearch } from "~/modules/search";

const props = defineProps({
  document: {
    type: Object as PropType<GenericDoc>,
    required: true,
  },
});

const s = useSearch();

const doc = computed(() => props.document);
const showDetails = ref(false);

const apiKind = computed(() => {
  if (doc.value._idx !== "api") {
    return "";
  }
  switch (doc.value.kind) {
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

const searchable = s.indexSettings[doc.value._idx as any]
  .searchableAttributes as string[];
</script>

<template>
  <div class="flex flex-col border-1 rounded px-2 py-1 border-gray-500">
    <div
      class="flex flex-row space-x-1 -mx-2 -my-1 px-2 py-1 items-center place-content-center cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
      @click="details"
    >
      <div
        v-if="doc._idx === 'repo'"
        class="flex flex-row flex-grow space-x-1 items-center place-items-center"
      >
        <mdi:github class="flex flex-shrink-0" />
        <div class="name font-semibold flex-shrink-0 pr-2">{{ doc.name }}</div>
        <div class="description flex flex-grow font-light text-sm truncate text-gray-500">
          {{ doc.description }}
        </div>
        <link-validation :url="(doc.url as string)" />
      </div>

      <div
        v-if="doc._idx === 'api'"
        class="flex flex-row flex-grow space-x-2 place-items-center items-center"
      >
        <vscode-icons:file-type-typescript-official
          v-if="doc.language === 'typescript'"
          class="flex flex-shrink-0"
        />
        <vscode-icons:file-type-rust v-if="doc.language === 'rust'" class="flex" />
        <span class="flex flex-grow">{{ doc.name }}</span>
        <div
          v-if="doc._idx === 'api'"
          class="flex text-xs font-medium px-1 py-0.5 bg-blue-500 dark:bg-blue-600 text-gray-50 rounded"
        >
          {{ apiKind }}
        </div>
        <link-validation :url="(doc.url as string)" />
      </div>

      <div
        v-if="doc._idx === 'prose'"
        class="flex flex-row flex-grow space-x-2 place-items-center items-center"
      >
        <ant-design:file-markdown-outlined class="flex" />
        <div class="name flex flex-grow">{{ doc.title }}</div>
        <link-validation :url="(doc.url as string)" />
      </div>

      <div v-if="doc._idx === 'consolidated'" class="w-full">
        <div
          v-if="doc.from === 'api'"
          class="flex flex-row flex-grow space-x-2 place-items-center items-center"
        >
          <vscode-icons:file-type-rust v-if="doc.language === 'rust'" class="flex" />
          <vscode-icons:file-type-typescript-official v-else class="flex" />

          <div class="symbolName font-semibold">
            <span class="font-light">
              {{ doc.area !== doc.symbol ? `${doc.area}::` : "" }}
            </span>
            <span>{{ doc.symbol }}</span>
          </div>
          <div class="text-sm font-light flex flex-grow">
            {{ doc.kind === "Namespace" ? "module" : doc.kind }}
          </div>

          <link-validation :url="(doc.url as string)" />
        </div>

        <!-- PROSE -->
        <div
          v-if="doc.from === 'prose'"
          class="flex flex-row flex-grow space-x-2 place-items-center items-center"
        >
          <teenyicons:text-document-solid class="flex flex-shrink-0" />
          <div class="title font-semibold flex-shrink-0">{{ doc.hierarchy_lvl0 }}</div>
          <div class="title font-light truncate text-gray-500 flex flex-grow">
            {{ doc.hierarchy_lvl1 || doc.content }}
          </div>
          <link-validation :url="(doc.url as string)" />
        </div>

        <!-- REPOs -->
        <div
          v-if="doc.from === 'repo'"
          class="flex flex-row space-x-2 place-items-start items-start"
        >
          <mdi:github class="flex flex-shrink-0 flex-grow-0" />
          <div class="name font-semibold flex-shrink-0 flex-grow-0">
            {{ doc.hierarchy_lvl0 }}
          </div>
          <div
            class="description truncate flex-shrink text-gray-500 font-light flex-grow"
          >
            {{ doc.hierarchy_lvl1 }}
          </div>
          <link-validation :url="(doc.url as string)" />
        </div>
      </div>
    </div>
    <div v-if="showDetails" class="items-start my-2">
      <div
        v-for="key in Object.keys(doc)"
        :key="key"
        class="flex items-start justify-start"
        :class="
          [
            searchable?.includes(key) || searchable[0] === '*' || false
              ? 'text-gray-800 dark:text-gray-200'
              : 'text-gray-500',
            String(doc[key]).length > 70 ? 'flex-col space-y-1' : 'flex-row space-x-2',
          ].join(' ')
        "
      >
        <div class="flex font-medium">{{ key }}:</div>
        <div class="flex font-light place-self-start">
          {{ doc[key] }}
        </div>
      </div>
      <div class="text-sm italic mt-2">
        key/values in grey are not "searchable" values and do not contribute to ranking.
      </div>
    </div>
  </div>
</template>
