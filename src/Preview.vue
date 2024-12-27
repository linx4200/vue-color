<script setup lang="ts">
import Checkerboard from './components/common/Checkerboard.vue';
</script>

<template>
  <div>Checkerboard</div>
  <div class="checkerboard-container">
    <Checkerboard />
  </div>
</template>

<style scoped>
.checkerboard-container {
  width: 500px;
  height: 20px;
  position: relative;
}
</style>
