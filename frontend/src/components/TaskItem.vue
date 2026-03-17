<template>
  <div class="task">
    <span :class="{ completed: task.completed }">
      {{ task.title }}
    </span>

    <div class="actions">
      <button 
        @click="$emit('toggle', task.id)" 
        :disabled="loading"
        :title="task.completed ? 'Mark as Pending' : 'Mark as Completed'"
      >
        {{ loading ? '...' : (task.completed ? '↩' : '✔') }}
      </button>
      
      <button 
        @click="$emit('delete', task.id)" 
        :disabled="loading"
        :title="'Delete Task'"
      >
        {{ loading ? '...' : '❌' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const props = defineProps(['task'])

const emit = defineEmits(['toggle', 'delete'])

const loading = ref(false)

async function toggleTask() {
  loading.value = true
  emit('toggle', props.task.id)
  loading.value = false
}


async function deleteTask() {
  loading.value = true
  emit('delete', props.task.id)
  loading.value = false
}
</script>

<style scoped>
.task {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  margin: 10px 0;
  border-radius: 10px;
  background: #f9f9f9;
  transition: 0.2s ease;
}

.task:hover {
  background: #f1f1f1;
}

.task span {
  font-size: 14px;
  color: #333;
  word-break: break-word;
}

.completed {
  text-decoration: line-through;
  color: #999;
}

.actions {
  display: flex;
  gap: 8px;
}

.actions button {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  transition: 0.2s ease;
}

.actions button:hover:not(:disabled) {
  transform: scale(1.2);
}

.actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}


button[title] {
  position: relative;
}
</style>