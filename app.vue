<template>
    <v-app>
      <v-navigation-drawer v-if="false"  v-model="drawer">
      </v-navigation-drawer>

      <v-app-bar>
        <v-app-bar-nav-icon v-if="false" @click="drawer = !drawer"></v-app-bar-nav-icon>

        <v-app-bar-title>
          <v-btn :to="`/projects`">
            projects
          </v-btn>
          <v-btn :to="`/fundings`">
            fundings
          </v-btn>
          <v-btn :to="`/info`">
            info
          </v-btn>
          <v-btn :to="`/pure`">
            Pure
          </v-btn>
        </v-app-bar-title>
      </v-app-bar>

      <v-main>
        <ClientOnly>
          <NuxtLayout>
            <NuxtPage />
          </NuxtLayout>
        </ClientOnly>
      </v-main>
    </v-app>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(null)
</script>

<script>
export default {
  data: () => ({ drawer: null }),
}
</script>
