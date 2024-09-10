<template>
  <!-- subtitle="hello world" -->
  <v-list-item
    class="my-2"
    title="Import Tool"
    prepend-icon="mdi-google-circles-extended"
  ></v-list-item>
  <v-divider></v-divider>
  <!-- dark mode switcher -->
  <v-list-item
    class="my-2"
    v-model="theme.global.current.dark"
    title="Dark Mode"
    @prepend-icon="prepare_icon()"
    @click="toggleTheme" />
  <v-divider></v-divider>
  <v-list-item to="/projects" title="Projects" />
  <v-list-item :to="`/templates`" link title="Templates" />
  <v-list-item :to="`/functions`" link title="Functions" />
  <v-divider></v-divider>
  <v-list-item :to="`/fundings`" link title="Fundings" />
  <v-list-item :to="`/info`" link title="Info" />
  <v-list-item :to="`/pure`" link title="Pure" />
</template>

<script setup>
import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme () {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

function prepend_icon() {
  return theme.global.current.value.dark ? 'mdi-white-balance-sunny' : 'mdi-moon-waning-crescent'
}
</script>
