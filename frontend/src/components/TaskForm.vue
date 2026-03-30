<template>
  <div class="mb-6">
    <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>

    <v-form @submit.prevent="submitTask" class="flex gap-4 items-start">
      <v-text-field
        v-model="title"
        label="Enter task..."
        variant="outlined"
        hide-details
        :disabled="loading"
        class="flex-1"
      ></v-text-field>
      
      <v-btn
        type="submit"
        color="primary"
        size="x-large"
        :loading="loading"
        :disabled="!title"
        height="56"
      >
        Add
      </v-btn>
    </v-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('')
const error = ref('')
const loading = ref(false)

const emit = defineEmits(['add'])

async function submitTask() {
  error.value = ''

  if (!title.value) {
    error.value = "Please enter a task"
    return
  }

  loading.value = true

  try {
    emit('add', { title: title.value })
    title.value = ''
  } catch (err) {
    error.value = "Failed to add task"
  } finally {
    loading.value = false
  }
}
</script>