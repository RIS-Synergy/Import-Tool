<template>
  <v-container fill-height fluid>
    <v-row
      style="height: 100vh"
      align="center" justify="center">
      <v-col>
        <v-sheet class="mx-auto" width="640">
          <div class="text-h3 mb-2">
            RIS Synergy
          </div>
          <div class="text-h4 mb-4">
            Import Tool
          </div>
          <LoginForm />
          <!-- {{ store.user }}<br/>
               {{ store.token }} -->
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: "custom",
});

// const store = useUserSettingsStore();
</script>
