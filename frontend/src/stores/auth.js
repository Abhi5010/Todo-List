import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    token: (state) => state.user?.token || null,
  },

  actions: {
    async login(email, password) {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      })

      this.user = response.data
      return response.data
    },

    async register(name, email, password) {
      const response = await axios.post('http://localhost:5000/api/register', {
        name,
        email,
        password,
      })

      return response.data
    },

    logout() {
      this.user = null
    },
  },

  persist: true,
})
