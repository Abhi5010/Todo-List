<template>
  <div class="container">
    <h2>Dashboard</h2>

    <div v-if="error" class="error">{{error}}</div>


    <div v-if="loading" class="loading">Loading tasks...</div>


    <TaskForm @add="addTask" />

    <div class="filters">
      <button @click="filter='all'" :class="{ active: filter === 'all' }">All</button>
      <button @click="filter='completed'" :class="{ active: filter === 'completed' }">Completed</button>
      <button @click="filter='pending'" :class="{ active: filter === 'pending' }">Pending</button>
    </div>

    <div v-if="!loading && filteredTasks.length === 0" class="no-tasks">
      No tasks yet. Add one above!
    </div>

    <TaskItem
      v-for="task in filteredTasks"
      :key="task.id"
      :task="task"
      @delete="deleteTask"
      @toggle="toggleTask"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import TaskForm from '../components/TaskForm.vue'
import TaskItem from '../components/TaskItem.vue'


const tasks = ref([])
const filter = ref('all')
const loading = ref(false)
const error = ref('')


const user = JSON.parse(localStorage.getItem('user'))


if (!user) {

  window.location.href = '/'
}


onMounted(async () => {
  await fetchTasks()
})


async function fetchTasks() {
  loading.value = true
  error.value = ''

  try {
    const response = await axios.get('http://localhost:5000/api/tasks', {
      headers: { Authorization: `Bearer ${user.token}` }
    })

    tasks.value = response.data
  } catch (err) {
    error.value = "Failed to load tasks"
  } finally {
    loading.value = false
  }
}

async function addTask(taskData) {
  try {
    await axios.post('http://localhost:5000/api/tasks', 
      { title: taskData.title },
      { headers: { Authorization: `Bearer ${user.token}` } }
    )

    await fetchTasks()
  } catch (err) {
    error.value = "Failed to add task"
  }
}


async function deleteTask(id) {
  try {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })

    tasks.value = tasks.value.filter(t => t.id !== id)
  } catch (err) {
    error.value = "Failed to delete task"
  }
}


async function toggleTask(id) {
  try {
    const task = tasks.value.find(t => t.id === id)

    await axios.put(
      `http://localhost:5000/api/tasks/${id}`,
      { completed: !task.completed },
      { headers: { Authorization: `Bearer ${user.token}` } }
    )

    task.completed = !task.completed
  } catch (err) {
    error.value = "Failed to update task"
  }
}

const filteredTasks = computed(() => {
  if (filter.value === 'completed') {
    return tasks.value.filter(t => t.completed)
  }

  if (filter.value === 'pending') {
    return tasks.value.filter(t => !t.completed)
  }

  return tasks.value
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