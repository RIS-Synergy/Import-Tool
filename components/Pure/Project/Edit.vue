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
      <v-col class="title" sm="2"> Title </v-col>
      <v-col sm="10">
        {{ item.title.en_GB }}
      </v-col>
    </v-row>

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

    <v-row v-if="false" no-gutters>
      <v-col class="title" sm="2"> Version </v-col>
      <v-col sm="10">
        {{ item.version }}
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="title" sm="2"> Participants </v-col>
      <v-col sm="10">
        <div v-for="p in item.participants">
          <PureParticipant :item="p" />
        </div>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="title" sm="2"> Period </v-col>
      <v-col sm="10">
        <div class="text">
          Period:
        </div>
        {{ item.period.startDate }} - {{ item.period.endDate }} <br />
        <div class="text">
          Effective Period:
        </div>
        {{ item.effectivePeriod.startDate }} - {{ item.effectivePeriod.endDate }}
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="title" sm="2"> Identifiers </v-col>
      <v-col sm="10">
        <div v-for="identifier in item.identifiers">
          <PureIdentifier :item="identifier" />
        </div>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col class="title" sm="2"> Organizations </v-col>
      <v-col sm="10">
        <div v-for="org in item.organizations">
          <PureOrganization :item="org" />
        </div>
      </v-col>
    </v-row>

    <v-row v-if="false" no-gutters>
      <v-col class="title" sm="2"> Managing Organization </v-col>
      <v-col sm="10">
        <PureOrganization :item="item.managingOrganization" />
      </v-col>
    </v-row>

  </v-container>
</template>

<style>
.title {
  font-weight: bold;
}

/* copy in a scss style global file */
.text {
  color: #999;
}
</style>
