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
    <FundingEdit label="Funding Scheme" v-model="model.fundingScheme" component="" />
    <FundingEdit label="Legal Type" v-model="model.legalType" />
    <FundingEdit label="Website" v-model="model.website" />
    <FundingEdit label="Running" v-model="model.running" /> <!-- bool -->
    <FundingEdit label="Call Volume Projects" v-model="model.callVolumeProjects" />
    <FundingEdit label="Call Stages" v-model="model.callStages" component="Default" />
    <FundingEdit label="Contacts" v-model="model.contacts" />
    <FundingEdit label="Amount" v-model="model.amount" />
    <FundingEdit label="Decision Processes" v-model="model.decisionProcesses" />
    <FundingEdit label="Decision Process Details" v-model="model.decisionProcessDetails" component="LangTrans" />
    <FundingEdit label="Submission Modes" v-model="model.submissionModes" />
    <FundingEdit label="DMP Required" v-model="model.dmpRequired" /> <!-- bool -->
    <FundingEdit label="DMP Guidelines" v-model="model.dmpGuidelines" />
    <FundingEdit label="Project Start" v-model="model.projectStart" component="LangTrans" />
    <FundingEdit label="Target Group Specified" v-model="model.targetGroupSpecified" component="LangTrans" />
    <FundingEdit label="Eligible Applicants" v-model="model.eligibleApplicants" component="LangTrans" />
    <FundingEdit label="Eligible Applicants Scope" v-model="model.eligibleApplicantsScope" />
    <FundingEdit label="Eligible Applicants Regions" v-model="model.eligibleApplicantsRegions" />
    <FundingEdit label="Min Project Volume" v-model="model.minProjectVolume" />
    <FundingEdit label="Max Project Volume" v-model="model.maxProjectVolume" />
    <FundingEdit label="Fully Funded" v-model="model.fullyFunded" /> <!-- bool -->
    <FundingEdit label="Min Inkind" v-model="model.minInkind" />
    <FundingEdit label="Inkind Details" v-model="model.inkindDetails" component="LangTrans" />
    <FundingEdit label="Max Overheads" v-model="model.maxOverHeads" />
    <FundingEdit label="Overheads Details" v-model="model.overheadsDetails" component="LangTrans" />
    <FundingEdit label="Min Project Duration" v-model="model.minProjectDuration" /> <!-- date -->
    <FundingEdit label="Max Project Duration" v-model="model.maxProjectDuration" /> <!-- date -->
    <FundingEdit label="Reporting Periods" v-model="model.reportingPeriods" component="LangTrans" />
    <FundingEdit label="Application Languages" v-model="model.applicationLanguages" />
    <FundingEdit label="Part Of" v-model="model.partOf" component="Default" />
    <FundingEdit label="Thematic Orientations" v-model="model.thematicOrientations" component="Default" />
  </v-container>

  <hr />
  <pre>
    {{ model }}
  </pre>
</template>

<script setup>
const model = defineModel()
</script>
