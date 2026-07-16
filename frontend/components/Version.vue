<template>
  <v-list-item class="smaller text-grey py-1">
    <v-list-item-title class="ml-0 font-weight-light d-flex flex-column">
      <div>
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
      </div>
      <div v-if="commitDate !== 'unknown'" class="commit-date-text mt-1 text-caption">
        {{ formattedDate }}
        <div>({{ timeAgo }})</div>
      </div>
    </v-list-item-title>
  </v-list-item>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { formatDistance } from 'date-fns'

const config = useRuntimeConfig()
const commit = computed(() => config.public.gitCommit || 'unknown')
const commitDate = computed(() => config.public.gitCommitDate || 'unknown')

const now = ref(new Date())
let intervalId

onMounted(() => {
  intervalId = setInterval(() => {
    now.value = new Date()
  }, 10000) // update every 10 seconds to keep it reactive
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

const formattedDate = computed(() => {
  if (commitDate.value === 'unknown') return ''
  try {
    const date = new Date(commitDate.value)
    return new Intl.DateTimeFormat('de-AT', {
      timeZone: 'Europe/Vienna',
      dateStyle: 'medium',
      timeStyle: 'medium'
    }).format(date)
  } catch (e) {
    return commitDate.value
  }
})

const timeAgo = computed(() => {
  if (commitDate.value === 'unknown') return ''
  try {
    const date = new Date(commitDate.value)
    return formatDistance(date, now.value, { addSuffix: true })
  } catch (e) {
    return ''
  }
})
</script>

<style scoped>
.commit-link {
  color: inherit;
  text-decoration: underline;
}
.commit-date-text {
  font-size: 0.75rem !important;
  opacity: 0.8;
  white-space: normal;
  line-height: 1.2;
}
</style>
