<template>
  <v-list>
    <v-list-item v-if="model.personId" title="Persion ID" :subtitle="model.personId" />
    <v-list-item
      v-if="model.electronicAddress"
      title="Email"
      :subtitle="model.electronicAddress"
    />
    <v-list-item v-if="model.personName" title="First Name" :subtitle="model.personName.firstName" />
    <v-list-item v-if="model.personName" title="Family Name" :subtitle="model.personName.familyName" />
    <TypeValues v-if="model.identifiers" v-model="model.identifiers" />
    <PureSearchPersons v-model="model.personName" :email="model.electronicAddress" />
  </v-list>
</template>

<script setup>
const model = defineModel();
</script>

<style scoped></style>
