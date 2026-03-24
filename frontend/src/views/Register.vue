<template>
  <v-container class="fill-height flex justify-center items-center h-screen">
    <v-card class="pa-8 w-full max-w-sm rounded-xl shadow-lg">
      <v-card-title class="text-center text-2xl font-bold mb-4">Register</v-card-title>
      
      <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>

      <v-form @submit.prevent="register">
        <v-text-field
          v-model="name"
          label="Name"
          variant="outlined"
          class="mb-2"
        ></v-text-field>

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
          class="mb-2"
        ></v-text-field>

        <v-text-field
          v-model="confirmPassword"
          label="Confirm Password"
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
          Register
        </v-btn>
      </v-form>

      <div class="mt-4 text-center text-sm">
        <router-link to="/" class="text-indigo-600 font-medium hover:underline">Back to Login</router-link>
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

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const error = ref('')
const loading = ref(false)

async function register() {
  error.value = ''

  if (!name.value || !email.value || !password.value) {
    error.value = "Please fill all fields"
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match"
    return
  }

  loading.value = true

  try {
    await authStore.register(name.value, email.value, password.value)
    alert("Registered successfully!")
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || err.message || "Registration failed"
  } finally {
    loading.value = false
  }
}
</script>