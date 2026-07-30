<script setup>
defineProps({
  label: {
    type: String,
    default: "Beta",
  },
});
</script>

<template>
  <span class="badge">{{ label }}</span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 0.2em 0.8em;
  border-radius: 999px;
  border: 1px solid var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 0.85em;
  font-weight: 600;
}
</style>
