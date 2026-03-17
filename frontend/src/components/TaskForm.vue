<template>
  <div class="form">
    <div v-if="error" class="error">{{ error }}</div>

    <input 
      v-model="title" 
      placeholder="Enter task..." 
      @keyup.enter="submitTask"
      :disabled="loading"
    />
    
    <button @click="submitTask" :disabled="loading || !title">
      {{ loading ? 'Adding...' : 'Add' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 1. Create variables to store data
const title = ref('')
const error = ref('')
const loading = ref(false)

// 2. Create the event emitter
const emit = defineEmits(['add'])

// 3. Function to submit task
async function submitTask() {
  // Reset any previous errors
  error.value = ''

  // Check if title is empty
  if (!title.value) {
    error.value = "Please enter a task"
    return
  }

  // Start loading
  loading.value = true

  try {
    // Emit the event to Dashboard
    emit('add', {
      title: title.value
    })

    // Clear the input
    title.value = ''
  } catch (err) {
    error.value = "Failed to add task"
  } finally {
    // Stop loading
    loading.value = false
  }
}
</script>

<style scoped>
.form {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}

input {
  flex: 1;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  transition: 0.2s ease;
}

input:focus {
  border-color: #42b983;
  outline: none;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

button {
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  background-color: #42b983;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s ease;
}

button:hover:not(:disabled) {
  background-color: #369f6e;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Error message style */
.error {
  color: red;
  margin-bottom: 10px;
  font-size: 14px;
  text-align: center;
}
</style>