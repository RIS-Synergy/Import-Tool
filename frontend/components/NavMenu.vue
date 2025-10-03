<template>
  <v-list>
    <!-- subtitle="hello world" -->
    <v-list-item
      class="my-2"
      title="Import Tool"
      prepend-icon="mdi-google-circles-extended"
    ></v-list-item>
    <v-divider></v-divider>
    <v-list-item>
      <!-- <UserLable /> -->
      User
      <template v-slot:append>
        <!-- <v-btn icon="mdi-menu-down" size="small" variant="text"></v-btn> -->
        <UserButton />
      </template>
    </v-list-item>

    <v-divider></v-divider>
    <!-- dark mode switcher -->
    <v-list-item
      class="my-2"
      v-model="theme.global.current.dark"
      title="Dark Mode"
      @prepend-icon="prepare_icon()"
      @click="toggleTheme"
    />
    <v-divider></v-divider>
    <v-list-item to="/projects" title="Projects" />
    <v-list-item class="smaller" :to="`/project/upload`" link title="Upload" />
    <v-list-item class="smaller" :to="`/project/download`" link title="Download" />
    <v-divider></v-divider>
    <v-list-item type="subheader" class="subheader"> Templates </v-list-item>
    <v-list-item
      class="smaller"
      :to="`/template/project`"
      link
      title="Projects"
    />
    <v-list-item
      class="smaller"
      :to="`/template/application`"
      link
      title="Applications"
    />
    <v-list-item
      class="smaller"
      :to="`/template/award`"
      link
      title="Awards / Grants"
    />
    <v-divider></v-divider>
    <v-list-item :to="`/searchCRIS`" link title="CRIS Search">
      <template v-slot:append>
        <v-icon>mdi-magnify</v-icon>
      </template>
    </v-list-item>
    <v-divider></v-divider>
    <v-list-item :to="`/functions`" link title="Functions">
      <template v-slot:append>
        <v-icon>mdi-file-code-outline</v-icon>
      </template>
    </v-list-item>
    <v-divider></v-divider>
    <v-list-item :to="`/info`" link title="Info" />
    <!-- Admin -->
    <v-divider v-if="isAdmin()"></v-divider>
    <v-list-item v-if="isAdmin()" :to="`/ri`" link title="Research Institutions">
      <template v-slot:append>
        <v-icon>mdi-school-outline</v-icon>
      </template>
    </v-list-item>
    <v-list-item :to="`/users`" link title="Users">
      <template v-slot:append>
        <v-icon>mdi-account-group</v-icon>
      </template>
    </v-list-item>
    <v-divider v-if="isAdmin()"></v-divider>
    <!-- End Admin -->
  </v-list>
</template>

<script setup>
import { useTheme } from "vuetify";

const theme = useTheme();

const store = useUserSettingsStore();

const { isAdmin } = useUser();

// if (store.dark) {
//   theme.global.name.value = "dark";
// }
//
function toggleTheme() {
  console.log(theme);

  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
  store.dark = !store.dark;
}

function prepend_icon() {
  return theme.global.current.value.dark
    ? "mdi-white-balance-sunny"
    : "mdi-moon-waning-crescent";
}
</script>

<style scoped>
.subheader {
  font-size-adjust: 0.5;
  font-weight: 300;
  padding: 4px 0;
}

.smaller {
  font-size-adjust: 0.5;
}
.smaller :deep() .v-list-item-title {
  /* background-color: #ff0000; */
  margin-left: 1em;
}
/* .v-list-item-title {
   font-size: 4px;
   } */
</style>
