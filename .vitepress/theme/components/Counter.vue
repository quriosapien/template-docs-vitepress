<script setup>
import { ref } from "vue";

const count = ref(0);
</script>

<template>
  <button class="counter-button" @click="count++">
    Clicked {{ count }} time{{ count === 1 ? "" : "s" }}
  </button>
</template>

<style scoped>
.counter-button {
  padding: 0.5em 1em;
  border-radius: 6px;
  border: 1px solid var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  cursor: pointer;
  font-weight: 600;
}

.counter-button:hover {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
}
</style>
