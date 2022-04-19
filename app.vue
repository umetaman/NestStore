<template>
  <v-app>
    <h1>Hello</h1>
    <p>{{ $route.path }}</p> <!-- /demo/2 -->
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { VApp } from 'vuetify/components'

export default defineComponent({
  components: {
    VApp
  }
})
</script>
