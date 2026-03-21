import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {

  // STATE
  const user = ref(null)

  // GETTERS
  const isLoggedIn = computed(() => !!user.value)
  const token = computed(() => user.value?.token || null)

  // ACTIONS
  async function login(email, password) {
    const response = await axios.post('http://localhost:5000/api/login', {
      email,
      password
    })
    user.value = response.data
  }

  async function register(name, email, password) {
    await axios.post('http://localhost:5000/api/register', {
      name,
      email,
      password
    })
  }

  function logout() {
    user.value = null
  }

  return { user, isLoggedIn, token, login, register, logout }

}, { persist: true })

