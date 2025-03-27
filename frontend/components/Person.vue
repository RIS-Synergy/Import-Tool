<template>
  <v-row>
    <v-col>
      <v-list-item v-if="model.personId" title="Persion ID" :subtitle="model.personId" />
      <v-list-item
        v-if="model.electronicAddress"
        title="Email"
        :subtitle="model.electronicAddress"
      />
    </v-col>
    <v-col>
      <v-list-item v-if="model.personName" title="First Name" :subtitle="model.personName.firstName" />
      <v-list-item v-if="model.personName" title="Family Name" :subtitle="model.personName.familyName" />
    </v-col>
  </v-row>
    <TypeValues v-if="model.identifiers" v-model="model.identifiers" />
    <PureSearchPersons v-if="hasCRIS()" v-model="model.personName" :email="model.electronicAddress" />
</template>

<script setup>
const model = defineModel();

const { hasCRIS } = useApiUtils();
</script>

<style scoped></style>
