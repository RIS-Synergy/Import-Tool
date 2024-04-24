<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const item = props.item;
</script>

<template>
  <v-card>
    <v-card-title>
      {{item.id}}
    </v-card-title>
    <v-container class="">
      <v-row no-gutters>
        <v-col class="title" sm="2">
          ID
        </v-col>
        <v-col sm="10">
          {{item.id}}
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col class="title" sm="2">
          Identifiers
        </v-col>
        <v-col sm="10">
          {{item.identifiers}}
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col class="title" sm="2">
          Type
        </v-col>
        <v-col sm="10">
          {{item.type}}
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col class="title" sm="2">
          Acronym
        </v-col>
        <v-col sm="10">
          {{item.acronym}}
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col class="title" sm="2">
          Title
        </v-col>
        <v-col sm="10">
          {{item.title[0]}}<br/>
          {{item.title[1]}}
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col class="title" sm="2">
          Date
        </v-col>
        <v-col sm="10">
          {{item.startDate}} - {{item.endDate}}
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col class="title" sm="2">
          Subject
        </v-col>
        <v-col sm="10">
          {{item.subjects}}
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col class="title" sm="2">
          Keyword
        </v-col>
        <v-col sm="10">
          {{item.keyword}}
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col class="title" sm="2">
          abstractPR
        </v-col>
        <v-col sm="10">
          {{item.abstractPR}}
        </v-col>
      </v-row>


      <v-row no-gutters>
        <v-col class="title" sm="2">
          Status
        </v-col>
        <v-col sm="10">
          {{item.status}}
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col class="title" sm="2">
          URL
        </v-col>
        <v-col sm="10">
          {{item.url}}
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col class="title" sm="2">
          Team
        </v-col>
        <v-col sm="10">
          {{item.team}}
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col class="title" sm="2">
          Funded
        </v-col>
        <v-col sm="10">
          {{item.funded}}
        </v-col>
      </v-row>

      <pre v-if="false" class="all">
        {{item}}
      </pre>
    </v-container>
  </v-card>
</template>

<style>
.title {
  font-weight: bold;
}

pre.all {
  background-color: #f5f5f5;
  font-size: 12px;
  padding: 10px;
  border-radius: 5px;
}
</style>
