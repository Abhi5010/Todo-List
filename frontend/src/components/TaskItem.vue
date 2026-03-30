<template>
  <v-list-item class="mb-3 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition-colors shadow-sm">
    <template v-slot:prepend>
      <v-checkbox-btn
        :model-value="task.completed"
        @click.stop="$emit('toggle', task.id)"
        color="success"
        class="mr-2"
      ></v-checkbox-btn>
    </template>

    <v-list-item-title 
      class="text-body-1 whitespace-normal break-words"
      :class="{ 'text-gray-400 line-through': task.completed, 'text-gray-800 font-medium': !task.completed }"
    >
      {{ task.title }}
    </v-list-item-title>

    <template v-slot:append>
      <v-btn
        icon="mdi-delete"
        variant="text"
        color="error"
        size="small"
        @click.stop="$emit('delete', task.id)"
        title="Delete Task"
      ></v-btn>
    </template>
  </v-list-item>
</template>

<script setup>
const props = defineProps(['task'])
const emit = defineEmits(['toggle', 'delete'])
</script>