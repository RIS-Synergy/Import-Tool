<template>
  <v-container>
    <FundingEdit label="ID" v-model="model.id" />
    <FundingEdit label="Type" v-model="model.type" />
    <FundingEdit label="Name" v-model="model.name" component="LangTrans" />
    <FundingEdit label="Identifiers" v-model="model.identifiers" />
    <FundingEdit label="Acronym" v-model="model.acronym" />
    <FundingEdit label="Description" v-model="model.description" component="LangTrans" />
    <FundingEdit label="Funder" v-model="model.funder" component="Default" />
    <FundingEdit label="Characteristics" v-model="model.characteristics" />
    <FundingEdit label="Target Groups" v-model="model.targetGroups" />
    <FundingEdit label="Subjects" v-model="model.subjects" component="Default" />
    <FundingEdit label="Career Stages" v-model="model.careerStages" />
    <FundingEdit label="Funding Scheme" v-model="model.fundingScheme" />
    <FundingEdit label="Legal Type" v-model="model.legalType" />
    <FundingEdit label="Website" v-model="model.website" />

    <FundingEdit label="Programme Tracks" v-model="model.programmeTracks" component="Default" />
    <FundingEdit label="Start Date" v-model="model.startDate" /> <!-- date -->
    <FundingEdit label="End Date" v-model="model.endDate" /> <!-- date -->
  </v-container>

  <hr />
  <pre>
    {{ model }}
  </pre>
</template>

<script setup>
const model = defineModel()
</script>
