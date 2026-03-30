<template>
  <v-container class="fill-height flex justify-center items-center h-screen">
    <v-card class="pa-8 w-full max-w-sm rounded-xl shadow-lg">
      <v-card-title class="text-center text-2xl font-bold mb-4">Login</v-card-title>
      
      <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>

      <v-form @submit.prevent="login">
        <v-text-field
          v-model="email"
          label="Email"
          variant="outlined"
          class="mb-2"
        ></v-text-field>

        <v-text-field
          v-model="password"
          label="Password"
          type="password"
          variant="outlined"
          class="mb-4"
        ></v-text-field>
        
        <v-btn
          type="submit"
          color="primary"
          block
          size="large"
          :loading="loading"
        >
          Login
        </v-btn>
      </v-form>

      <div class="mt-4 text-center text-sm text-gray-700">
        Don't have an account? 
        <router-link to="/register" class="text-indigo-600 font-medium hover:underline">Register</router-link>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function login() {
  error.value = ''

  if (!email.value || !password.value) {
    error.value = "Please fill all fields"
    return
  }

  loading.value = true

  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || "Login failed"
  } finally {
    loading.value = false
  }
}
</script>