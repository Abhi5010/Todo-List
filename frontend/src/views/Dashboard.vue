<template>
  <div class="container">
    <h2>Dashboard</h2>

    <div v-if="taskStore.error" class="error">{{ taskStore.error }}</div>

    <div v-if="taskStore.loading" class="loading">Loading tasks...</div>

    <TaskForm @add="(taskData) => taskStore.addTask(taskData.title)" />

    <div class="filters">
      <button @click="filter='all'" :class="{ active: filter === 'all' }">All</button>
      <button @click="filter='completed'" :class="{ active: filter === 'completed' }">Completed</button>
      <button @click="filter='pending'" :class="{ active: filter === 'pending' }">Pending</button>
    </div>

    <div v-if="!taskStore.loading && filteredTasks.length === 0" class="no-tasks">
      No tasks yet. Add one above!
    </div>

    <TaskItem
      v-for="task in filteredTasks"
      :key="task.id"
      :task="task"
      @delete="taskStore.deleteTask"
      @toggle="taskStore.toggleTask"
    />
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useTaskStore } from '../stores/task'
import TaskForm from '../components/TaskForm.vue'
import TaskItem from '../components/TaskItem.vue'

const authStore = useAuthStore()
const taskStore = useTaskStore()

const filter = ref('all')

if (!authStore.isLoggedIn) {
  window.location.href = '/'
}

onMounted(async () => {
  await taskStore.fetchTasks()
})

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

<style scoped>
.container {
  width: 550px;
  margin: 80px auto;
  padding: 30px;
  border-radius: 14px;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}

.filters {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}

.filters button {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #42b983;
  background: transparent;
  color: #42b983;
  cursor: pointer;
  transition: 0.2s ease;
}

.filters button:hover {
  background: #42b983;
  color: white;
}

.filters button.active {
  background: #42b983;
  color: white;
}

.filters button:focus {
  outline: none;
}

.task-list {
  margin-top: 20px;
}


.loading {
  text-align: center;
  color: #666;
  margin: 20px 0;
}

.error {
  color: red;
  margin-bottom: 10px;
  font-size: 14px;
  text-align: center;
}

.no-tasks {
  text-align: center;
  color: #999;
  margin: 20px 0;
}
</style>