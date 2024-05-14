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
  <v-container class="">
    <v-row no-gutters>
      <v-col class="title" sm="2"> Pure ID </v-col>
      <v-col sm="10">
        {{ item.pureId }}
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="title" sm="2"> UUID </v-col>
      <v-col sm="10">
        {{ item.uuid }}
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="title" sm="2"> Created </v-col>
      <v-col sm="10">
        {{ item.createdBy }} {{ item.createdDate }}
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="title" sm="2"> Modified </v-col>
      <v-col sm="10">
        {{ item.modifiedBy }} {{ item.modifiedDate }}
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="title" sm="2"> Portal URL </v-col>
      <v-col sm="10">
        <a :href="item.portalUrl" target="_blank">
          {{ item.portalUrl }}
        </a>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="title" sm="2"> Version </v-col>
      <v-col sm="10">
        {{ item.version }}
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="title" sm="2"> Participants </v-col>
      <v-col sm="10">
        <pre>
          {{ item.participants }}
        </pre>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="title" sm="2"> Period </v-col>
      <v-col sm="10">
        {{ item.period.startDate }} - {{ item.period.endDate }} <br />
        {{ item.effectivePeriod.startDate }} - {{ item.effectivePeriod.endDate }}
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="title" sm="2"> Identifiors </v-col>
      <v-col sm="10">
        <pre>
          {{ item.identifiers }}
        </pre>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="title" sm="2"> Organizations </v-col>
      <v-col sm="10">
        <pre>
          {{ item.organizations }}
        </pre>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="title" sm="2"> Managing Organization </v-col>
      <v-col sm="10">
        <pre>
          {{ item.managingOrganization }}
        </pre>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="title" sm="2"> Title </v-col>
      <v-col sm="10">
        <pre>
          {{ item.title }}
        </pre>
      </v-col>
    </v-row>
  </v-container>
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
