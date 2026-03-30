<template>
  <v-container class="max-w-3xl mt-12">
    <v-card class="pa-6 rounded-xl shadow-lg">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold text-gray-800">Dashboard</h2>
        <v-btn color="error" variant="text" @click="logout" prepend-icon="mdi-logout">Logout</v-btn>
      </div>

      <v-alert v-if="taskStore.error" type="error" variant="tonal" class="mb-4">{{ taskStore.error }}</v-alert>

      <v-progress-linear v-if="taskStore.loading" indeterminate color="primary" class="mb-4"></v-progress-linear>

      <TaskForm @add="(taskData) => taskStore.addTask(taskData.title)" />

      <div class="flex justify-center gap-3 my-6">
        <v-btn 
          size="small" 
          :variant="filter === 'all' ? 'flat' : 'outlined'" 
          color="primary" 
          @click="filter='all'"
          rounded="pill"
        >All</v-btn>
        <v-btn 
          size="small" 
          :variant="filter === 'completed' ? 'flat' : 'outlined'" 
          color="primary" 
          @click="filter='completed'"
          rounded="pill"
        >Completed</v-btn>
        <v-btn 
          size="small" 
          :variant="filter === 'pending' ? 'flat' : 'outlined'" 
          color="primary" 
          @click="filter='pending'"
          rounded="pill"
        >Pending</v-btn>
      </div>

      <v-list class="bg-transparent" v-if="filteredTasks.length > 0">
        <TaskItem
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task"
          @delete="taskStore.deleteTask"
          @toggle="taskStore.toggleTask"
        />
      </v-list>

      <div v-else-if="!taskStore.loading" class="text-center text-gray-500 my-8 italic">
        No tasks found. Let's get things done!
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTaskStore } from '../stores/task'
import TaskForm from '../components/TaskForm.vue'
import TaskItem from '../components/TaskItem.vue'

const router = useRouter()
const authStore = useAuthStore()
const taskStore = useTaskStore()

const filter = ref('all')

if (!authStore.isLoggedIn) {
  router.push('/')
}

onMounted(async () => {
  if (authStore.isLoggedIn) {
    await taskStore.fetchTasks()
  }
})

function logout() {
  authStore.logout()
  router.push('/')
}

const filteredTasks = computed(() => {
  if (filter.value === 'completed') {
    return taskStore.tasks.filter(t => t.completed)
  }

  if (filter.value === 'pending') {
    return taskStore.tasks.filter(t => !t.completed)
  }

  return taskStore.tasks
})
</script>