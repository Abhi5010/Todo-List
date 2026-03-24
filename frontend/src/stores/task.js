import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    loading: false,
    error: '',
  }),

  actions: {
    async fetchTasks() {
      const authStore = useAuthStore()
      this.loading = true
      this.error = ''

      try {
        const response = await axios.get('http://localhost:5000/api/tasks', {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        })

        this.tasks = response.data
        return response.data
      } catch (err) {
        this.error = 'Failed to load tasks'
        throw err
      } finally {
        this.loading = false
      }
    },

    async addTask(title) {
      const authStore = useAuthStore()
      this.error = ''

      try {
        await axios.post(
          'http://localhost:5000/api/tasks',
          { title },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        )

        await this.fetchTasks()
      } catch (err) {
        this.error = 'Failed to add task'
        throw err
      }
    },

    async deleteTask(id) {
      const authStore = useAuthStore()
      this.error = ''

      try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        })

        this.tasks = this.tasks.filter((t) => t.id !== id)
      } catch (err) {
        this.error = 'Failed to delete task'
        throw err
      }
    },

    async toggleTask(id) {
      const authStore = useAuthStore()
      this.error = ''

      const task = this.tasks.find((t) => t.id === id)
      if (!task) return

      try {
        await axios.patch(
          `http://localhost:5000/api/tasks/${id}`,
          { completed: !task.completed },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        )

        task.completed = !task.completed
      } catch (err) {
        this.error = 'Failed to update task'
        throw err
      }
    },
  },
})
