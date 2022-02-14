<script setup lang="ts">
/* eslint-disable no-console */
import { useSearch } from "~/modules/search";
import { format } from "date-fns";
import { PropType } from "vue";
import { ApiModel } from "tauri-search";
import type { IMeilisearchInterface} from "tauri-search";
const s = useSearch();
const props = defineProps({
  idx: {type: Object as PropType<IMeilisearchInterface>, required: true},
  unknown: {type: Boolean, default: false, required: false}
});
const settings = computed(() => s.$state.indexSettings[props.idx.name]);
const indexName = computed(() => props.idx.name as "api" | "repo" | "prose");

const remove = async () => {
  // just using ApiModel at random, as we can state which index to remove
  await ApiModel().query.deleteIndex(indexName.value);
};

const pushCache = async() =>  {
  // console.group(`downloading cached docs for "${indexName.value}"`);
  // const docs = await getCache(indexName.value);
  // console.info(`${docs.length} docs downloaded, now calling Meilisearch API to add each doc`);
  // const tasks = await pushDocs(docs);
  // console.info(`all documents have been sent to the MeiliSearch API where they will be processed in a task queu`);
  // console.log(`The tasks in queue are:`, tasks);
  // console.groupEnd();
};

const usedInSearch = computed(() => s.indexIsUsed(indexName.value));

// async function pushCache() {
//   const docs = await 
// }
</script>

<template>
    <div
      class="index flex flex-row w-full py-2 px-3 border-1 rounded border-gray-500 mt-4 cursor-default items-center justify-center"
      :class="props.unknown ? 'unknown' : ''"
    >
      <checkbox :value="usedInSearch" @click="s.toggleUseOfIndex(indexName)" />
      <span class="index-name flex flex-grow font-medium">{{indexName}}</span>
      <div class="flex flex-row items-center">
        <!-- Right Content -->
        <v-tooltip v-if="s.indexInfo(indexName)?.numberOfDocuments === 0 && !props.unknown" class="cursor-pointer text-sm flex flex-grow-0 mr-3 text-gray-500 hover:text-green-800 dark:hover:text-green-500">
          <iconoir:download class="" @click="pushCache" />
          <template #popper>Push documents in cache into<br/>local MeiliSearch server</template>
        </v-tooltip>
        <v-tooltip>
          <octicon:trash-16
            class="cursor-pointer text-sm flex flex-grow-0 mr-3 text-gray-500 hover:text-red-800 dark:hover:text-red-500"
            @click="remove"
          />
          <template #popper>remove "{{indexName}}" index<span v-if="s.indexInfo(indexName)?.numberOfDocuments || 0 > 0">; including all documents.</span></template>
        </v-tooltip>
        <span class="index-count flex flex-grow-0 font-light items-baseline ">
          <span class="flex">{{s.indexInfo(indexName)?.numberOfDocuments}}</span>
          &nbsp;
          <span class="flex italic font-light text-xs">docs</span>
        </span>
        <v-tooltip placement="right" >
          <ph:info
            class=" flex flex-grow-0 ml-2 dark:text-gray-500/75 hover:text-opacity-100 "
          />
          <template #popper>
            <div class="w-96 text-sm p-2">
              <div class="font-bold text-lg">
                {{indexName}}
                &nbsp;
                <span class="font-light">index</span>
              </div>
              <table width="100%">
                <tr>
                  <td class="font-normal w-100px">created:</td>
                  <td  class="font-light" align="left">{{format(new Date(props.idx.createdAt), "do MMM, yyyy")}}</td>
                </tr>
                <tr>
                  <td class="font-normal">updated:</td>
                  <td class="font-light justify-end" align="left" >{{format(new Date(props.idx.updatedAt), "do MMM, yyyy")}}</td>
                </tr>
                <tr>
                  <td>stop words</td>
                  <td>{{settings?.stopWords?.length}} words</td>
                </tr>
                <tr>
                  <td>synonyms</td>
                  <td>{{Object.keys(settings?.synonyms || {}).length}} keys</td>
                </tr>
                <tr>
                  <td>searchable</td>
                  <td>{{settings.searchableAttributes?.join(", ")}}</td>
                </tr>
                <tr>
                  <td>sortable</td>
                  <td>{{settings.sortableAttributes?.join(", ")}}</td>
                </tr>
                <tr>
                  <td>displayed</td>
                  <td>{{settings.displayedAttributes?.join(", ")}}</td>
                </tr>
                <tr>
                  <td>rules</td>
                  <td>{{settings.rankingRules?.join(" -> ")}}</td>
                </tr>
                <tr v-if="s.indexInfo(indexName)?.numberOfDocuments || 0 > 0" class="text-xs">
                  <td>Prop<br/>Distribution</td>
                  <td>
                    <table width="100%">
                      <tr v-for="k in Object.keys(s.$state.stats?.indexes[indexName].fieldDistribution|| {}) " :key="k">
                        <td>{{ k }}</td>
                        <td>{{ s.$state.stats?.indexes[indexName].fieldDistribution[k]}}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                  
              </table>
            </div>
          </template>
        </v-tooltip>
      </div>
    
    </div>

</template>

<style lang="css" scoped>
.unknown {
  @apply border-orange-500/50
}
table, th, td {
  @apply border-1 border-solid border-gray-500/25;
}

table {
  @apply rounded mt-4;
}

td {
  @apply p-1;
}
</style>
