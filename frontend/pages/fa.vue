<template>
  <AppBar title="Funding Agencies" />
  <v-container>
    <v-dialog v-model="cancelDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Cancel Job?</v-card-title>
        <v-card-text>Are you sure you want to cancel this background process? This cannot be undone.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="cancelDialog = false">No, Keep Running</v-btn>
          <v-btn color="error" variant="text" @click="confirmCancel">Yes, Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row>
      <v-col
        v-for="item in data"
        :key="item.id"
        cols="12"
      >
        <v-card >
          <v-card-title>
            {{ item.data.name }}
          </v-card-title>
          <v-card-subtitle>
            {{ item.data.acronym }}
          </v-card-subtitle>
          <v-card-text>
            <div><strong>ID:</strong> {{ item.id }}</div>
            <div v-if="isSyncing(item.id)" class="mt-2 text-caption text-primary">
              <div class="d-flex justify-space-between align-center">
                <span>{{ syncProgress(item.id) }}</span>
                <span class="ml-2 font-weight-bold">{{ jobDuration(`fa-sync-${item.id}`) }}</span>
                <v-btn icon="mdi-cancel" variant="text" size="small" color="error" @click="openCancelDialog(`fa-sync-${item.id}`)"></v-btn>
              </div>
            </div>
            <div v-if="syncResult(item.id)" class="mt-2 text-caption pa-2 rounded">
              <hr class="mb-1" />
              <div class="d-flex justify-space-between align-center">
                <span>
                  <v-icon size="small" class="mr-1 text-success">mdi-check-circle</v-icon>
                  <strong class="text-success">Sync Complete</strong>
                  <span class="text-grey-darken-1 ml-2 text-caption">Finished {{ jobFinishedAgo(`fa-sync-${item.id}`) }}</span>
                </span>
                <span class="text-grey-darken-1">took {{ jobDuration(`fa-sync-${item.id}`) }}</span>
              </div>
              <div v-if="syncResult(item.id).countStats.new.sampleIds.length > 0" class="mt-1">
                <strong>New Projects:</strong> {{ syncResult(item.id).countStats.new.sampleIds.join(', ') }}
              </div>
              <div v-if="syncResult(item.id).countStats.existing.sampleIds.length > 0" class="mt-1">
                <strong>Existing Projects:</strong> {{ syncResult(item.id).countStats.existing.sampleIds.join(', ') }}
              </div>
              <div v-if="syncResult(item.id).countStats.updated.sampleIds.length > 0" class="mt-1">
                <strong>Updated Projects:</strong> {{ syncResult(item.id).countStats.updated.sampleIds.join(', ') }}
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn 
              variant="outlined" 
              @click="handleSync(item.id)"
              :disabled="isSyncing(item.id)"
              :loading="isSyncing(item.id)"
            >
              Sync
            </v-btn>
            <FADeleteButton :item-id="item.id" @deleted="handleDeleted" />
            <FAFormButton
              :item-id="item.id"
              @submitted="(formData) => handleFormSubmit(formData, item.id)"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useJobs } from "~/composables/use-jobs";
import { intervalToDuration, formatDistance } from "date-fns";

const { fa } = useApiUtils();
const { listAll, startSync, createFa, updateFa } = (await fa).default;
const data = ref(await listAll());

const { getJobById, fetchJobs, cancelJob } = useJobs();

const now = ref(new Date());
let timer;
onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date();
  }, 1000);
});
onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const jobDuration = (jobId) => {
  const job = getJobById(jobId);
  if (!job) return '';
  const end = ['COMPLETED', 'FAILED', 'CANCELLED'].includes(job.status) 
    ? new Date(job.updatedAt) 
    : now.value;
  
  const duration = intervalToDuration({ start: new Date(job.createdAt), end });
  const mm = String(duration.minutes || 0).padStart(2, '0');
  const ss = String(duration.seconds || 0).padStart(2, '0');
  return `${mm}:${ss}`;
};

const jobFinishedAgo = (jobId) => {
  const job = getJobById(jobId);
  if (!job || job.status !== 'COMPLETED') return '';
  return formatDistance(new Date(job.updatedAt), now.value, { addSuffix: true });
};

const cancelDialog = ref(false);
const jobToCancel = ref("");

const openCancelDialog = (jobId) => {
  jobToCancel.value = jobId;
  cancelDialog.value = true;
};

const confirmCancel = async () => {
  if (jobToCancel.value) {
    await cancelJob(jobToCancel.value);
  }
  cancelDialog.value = false;
  jobToCancel.value = "";
};

const isSyncing = (id) => {
  const job = getJobById(`fa-sync-${id}`);
  return job && job.status === 'RUNNING';
};

const syncProgress = (id) => {
  const job = getJobById(`fa-sync-${id}`);
  if (!job) return '';
  return job.message || `Syncing... ${job.progress}`;
};

const syncResult = (id) => {
  const job = getJobById(`fa-sync-${id}`);
  return job && job.status === 'COMPLETED' ? job.result : null;
};

const handleSync = async (id) => {
  await startSync(id);
  fetchJobs(); // Trigger immediate fetch to update UI
};

const handleFormSubmit = async (formData, itemId) => {
  try {
    if (itemId) {
      await updateFa(itemId, formData);
    } else {
      await createFa(formData);
    }

    data.value = await listAll();
  } catch (error) {
    console.error("Error saving funding agency:", error);
  }
};

const handleDeleted = (deletedId) => {
  data.value = data.value.filter((item) => item.id !== deletedId);
};
</script>
