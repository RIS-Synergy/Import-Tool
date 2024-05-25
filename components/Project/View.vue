<template>
  <v-container>
    <ProjectEdit label="ID" v-model="model.id" />
    <ProjectEdit
      label="Identifiers"
      v-model="model.identifiers"
      component="TypeValues"
    />
    <ProjectEdit label="Type" v-model="model.type" />
    <ProjectEdit label="Acronym" v-model="model.acronym" />
    <ProjectEdit label="Title" v-model="model.title" component="LangTrans" />
    <ProjectEdit label="Start Date" v-model="model.startDate" />
    <ProjectEdit label="End Date" v-model="model.endDate" />
    <ProjectEdit label="Subjects" v-model="model.subjects"
                 component="Fractions"
    />
    <ProjectEdit
      label="Keyword"
      v-model="model.keyword"
      component="LangTrans"
    />
    <ProjectEdit
      label="Abstract PR"
      v-model="model.abstractPR"
      component="LangTrans"
    />
    <ProjectEdit label="Status" v-model="model.status" />
    <ProjectEdit label="URL" v-model="model.url" />
    <ProjectEdit label="Team" v-model="model.team" component="Teams" />
    <ProjectEdit label="Funded" v-model="model.funded" component="Fundeds" />
  </v-container>
  <hr />
  <pre v-if="false">
    {{ model }}
  </pre>
</template>

<script setup>
const model = defineModel();
</script>

<style>
pre.all {
  background-color: #f5f5f5;
  font-size: 12px;
  padding: 10px;
  border-radius: 5px;
}
</style>
