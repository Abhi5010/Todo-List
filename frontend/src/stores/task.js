import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useTaskStore = defineStore('task', () => {

  // STATE
  const tasks = ref([])
  const loading = ref(false)
  const error = ref('')

  // ACTIONS
  async function fetchTasks() {
    const authStore = useAuthStore()
    loading.value = true
    error.value = ''

    try {
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      tasks.value = response.data
    } catch (err) {
      error.value = 'Failed to load tasks'
    } finally {
      loading.value = false
    }
  }

  async function addTask(title) {
    const authStore = useAuthStore()

    try {
      await axios.post('http://localhost:5000/api/tasks',
        { title },
        { headers: { Authorization: `Bearer ${authStore.token}` } }
      )
      await fetchTasks()
    } catch (err) {
      error.value = 'Failed to add task'
    }
  }

  async function deleteTask(id) {
    const authStore = useAuthStore()

    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      tasks.value = tasks.value.filter(t => t.id !== id)
    } catch (err) {
      error.value = 'Failed to delete task'
    }
  }

  async function toggleTask(id) {
    const authStore = useAuthStore()
    const task = tasks.value.find(t => t.id === id)

    try {
      await axios.patch(
        `http://localhost:5000/api/tasks/${id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${authStore.token}` } }
      )
      task.completed = !task.completed
    } catch (err) {
      error.value = 'Failed to update task'
    }
  }

  return { tasks, loading, error, fetchTasks, addTask, deleteTask, toggleTask }
})
