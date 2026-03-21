<template>
  <div class="container">
    <h2>Register</h2>

    <!-- Show error message if there is one -->
    <div v-if="error" class="error">{{ error }}</div>

    <input v-model="name" placeholder="Name" />
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <input v-model="confirmPassword" type="password" placeholder="Confirm Password" />

    <!-- Show loading spinner while sending data -->
    <button @click="register" :disabled="loading">
      {{ loading ? 'Registering...' : 'Register' }}
    </button>

    <router-link to="/">Back to Login</router-link>
  </div>
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
    error.value = err.response?.data?.message || "Registration failed"
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  width: 350px;
  margin: 100px auto;
  padding: 30px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: Arial, sans-serif;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

input {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  transition: 0.2s ease;
}

input:focus {
  border-color: #42b983;
  outline: none;
  box-shadow: 0 0 0 2px rgba(66, 185, 131, 0.2);
}

button {
  width: 100%;
  padding: 10px;
  margin-top: 12px;
  border: none;
  border-radius: 6px;
  background-color: #42b983;
  color: white;
  font-size: 15px;
  cursor: pointer;
  transition: 0.2s ease;
}

button:hover {
  background-color: #369f6e;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

a {
  display: block;
  margin-top: 15px;
  text-decoration: none;
  color: #42b983;
  font-size: 14px;
}

a:hover {
  text-decoration: underline;
}

.error {
  color: red;
  margin-bottom: 10px;
  font-size: 14px;
}
</style>