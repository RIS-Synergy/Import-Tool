<template>
  <v-list>
    <v-list-item
      class="my-2"
      title="Import Tool"
      prepend-icon="mdi-google-circles-extended"
    ></v-list-item>
    <v-divider></v-divider>
    <UserLable />
    <CrisLable />
    <v-divider></v-divider>
    <v-list-item to="/dashboard" title="Dashboard" >
      <template v-slot:append>
        <v-icon>mdi-view-dashboard</v-icon>
      </template>
    </v-list-item>
    <v-list-item to="/projects" title="Projects" >
      <template v-slot:append>
        <v-icon>mdi-book-open-page-variant</v-icon>
      </template>
    </v-list-item>
    <v-list-item class="smaller" :to="`/project/upload`" link title="Upload" />
    <v-list-item
      class="smaller"
      :to="`/project/download`"
      link
      title="Download"
    />
    <v-divider></v-divider>
    <v-list-item type="subheader" class="subheader"> Templates
      <template v-slot:append>
        <v-icon>mdi-file-code</v-icon>
      </template>
    </v-list-item>
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
    <v-list-item v-if="false" :to="`/info`" link title="Info" />
    <v-divider />
    <!-- Admin -->
    <!-- <v-divider v-if="isAdmin()"></v-divider> -->
    <v-list-item :to="`/ri`" link title="Research Institutions">
      <template v-slot:append>
        <v-icon>mdi-school-outline</v-icon>
      </template>
    </v-list-item>
    <v-divider />
    <v-list-item :to="`/users`" link title="Users">
      <template v-slot:append>
        <v-icon>mdi-account-group</v-icon>
      </template>
    </v-list-item>
    <v-divider />
    <v-list-item :to="`/cris`" link title="CRIS">
      <template v-slot:append>
        <v-icon>mdi-api</v-icon>
      </template>
    </v-list-item>
    <v-divider />
    <v-list-item :to="`/fa`" link title="Funding Agencies">
      <template v-slot:append>
        <v-icon>mdi-cash-multiple</v-icon>
      </template>
    </v-list-item>
    <v-divider />
    <v-list-item :to="`/oefos`" link title="OeFOS">
      <template v-slot:append>
        <v-icon>mdi-file-tree</v-icon>
      </template>
    </v-list-item>
    <v-divider />
    <!-- <v-divider v-if="isAdmin()"></v-divider> -->
    <!-- End Admin -->

    <v-divider></v-divider>
  </v-list>
</template>

<script setup>
const { isAdmin } = useUser();
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
