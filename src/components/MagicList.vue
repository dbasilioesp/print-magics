<script setup lang="js">
import MagicSelect  from './MagicSelect.vue'

const selectedMagics = defineModel()

defineProps({
    label: String,
    magics: Array
})
</script>

<template>
  <h3 class="magicGroupTitle">{{ label }}</h3>
  <div class="rollGrid" style="--min: 220px; --mt: 20px">
    <MagicSelect
      v-for="magic in magics"
      :key="magic.Titulo"
      :magia="magic"
      v-model="selectedMagics"
    />
  </div>
</template>

<style scoped>
.magicGroupTitle {
  margin-top: 30px;
}

.rollGrid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(var(--min, 150px), 1fr));
  gap: 20px 30px;
  margin-top: var(--mt, 60px);
}
</style>
