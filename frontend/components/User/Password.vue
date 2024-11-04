<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn @click="dialog = true"> Update Password </v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card title="Edit Password">
        <v-card-text>
          <v-text-field label="Old Password" v-model="oldPassword" type="password" />
          <v-text-field label="New Password" v-model="password1" type="password" />
          <v-text-field label="Confirm Password" v-model="password2" type="password" />
          <span v-if="error"> Password error </span>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="updatePasswordValid"> Update Password </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
const dialog = ref(false);

const oldPassword = ref("");
const password1 = ref("");
const password2 = ref("");
const error = ref(false);

const { updatePassword } = useApiUtils();

async function updatePasswordValid() {
  if (password1.value !== password2.value) {
    alert("Passwords do not match");
    return;
  }

  const result = await updatePassword(password1.value);
}
</script>
