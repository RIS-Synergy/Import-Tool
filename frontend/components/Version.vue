<template>
  <v-list-item class="smaller text-grey">
    <v-list-item-title class="ml-0 font-weight-light">
      <a
        v-if="commit !== 'unknown'"
        :href="`https://github.com/RIS-Synergy/Import-Tool/commit/${commit}`"
        target="_blank"
        rel="noopener noreferrer"
        class="commit-link"
      >
        {{ commit }}
      </a>
      <span v-else>{{ commit }}</span>
    </v-list-item-title>
  </v-list-item>
</template>

<script setup>
const config = useRuntimeConfig()
const commit = computed(() => config.public.gitCommit || 'unknown')
</script>

<style scoped>
.commit-link {
  color: inherit;
  text-decoration: underline;
}
</style>
