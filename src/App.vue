<template>
  <div class="flex flex-col items-center md:p-8 md:bg-purple-300" id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HomePage from '@/components/HomePage.vue';

@Component({
  components: {
    HomePage,
  },
})
export default class App extends Vue {}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  @apply h-full;
}

html, body {
  height: 100%;
}
</style>
