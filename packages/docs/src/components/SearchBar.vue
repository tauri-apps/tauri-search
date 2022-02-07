<script setup lang="ts">
  import docsSearchBar from "docs-searchbar.js";

  docsSearchBar({
    hostUrl: "http://localhost:7700",
    apiKey: "",
    indexUid: "docs",
    inputSelector: "#search-bar-input",
  });
</script>


<template>
  <div>
    <input id="search-bar-input" type="text">
  </div>
</template>
