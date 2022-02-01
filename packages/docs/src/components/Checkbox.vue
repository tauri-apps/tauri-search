<script setup lang="ts">import { PropType } from "vue";

  const props = defineProps({
    value: {type: Boolean as PropType<boolean | undefined>, default: undefined, required: true}
  });

  const toggle = () => {

  };
</script>

<template>
  <div class="checkbox text-xl mr-1">
    <bx:bx-checkbox-minus v-if="props.value === undefined" class="flex cursor-default text-gray-500/50" />
    <bx:bx-checkbox v-if="props.value=== false" class="flex cursor-pointer text-gray-500/75" @click="toggle" />
    <bx:bx-checkbox-checked v-if="props.value===true" class="flex cursor-pointer text-gray-800/95 dark:text-gray-100/90" @click="toggle" />

  </div>
</template>
