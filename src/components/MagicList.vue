<script setup lang="js">
import { ref } from 'vue';
import MagicSelect  from './MagicSelect.vue'
import DialogMagicInfo from "./DialogMagicInfo.vue";

const selectedMagics = defineModel()

const props = defineProps({
    label: String,
    magics: Array
})

const magicInfo = ref(null);

const openModal = (magic) => {
  magicInfo.value = magic;
}

const handleNext = () => {
  const index = props.magics.findIndex(magic => magicInfo.value.Titulo == magic.Titulo)
  const nextIndex = index + 1;
  if (props.magics[nextIndex]) {
    magicInfo.value = props.magics[nextIndex]
  } else {
    magicInfo.value = props.magics[0]
  }
}

const handlePrevious = () => {
  const index = props.magics.findIndex(magic => magicInfo.value.Titulo == magic.Titulo)
  const prevIndex = index - 1;
  if (props.magics[prevIndex]) {
    magicInfo.value = props.magics[prevIndex]
  } else {
    magicInfo.value = props.magics[props.magics.length - 1]
  }
}
</script>

<template>
  <h3 class="magicGroupTitle">{{ label }}</h3>
  <div class="rollGrid" style="--min: 220px; --mt: 20px">
    <MagicSelect
      v-for="magic in magics"
      :key="magic.Titulo"
      :magia="magic"
      v-model="selectedMagics"
      @info="openModal"
    />
  </div>
  <DialogMagicInfo
    id="magicInfo"
    v-model="magicInfo"
    @next="handleNext"
    @previous="handlePrevious"
  />
</template>

<style scoped>
.magicGroupTitle {
  margin-top: 30px;
}

.rollGrid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(var(--min, 150px), 1fr));
  gap: 8px 8px;
  margin-top: var(--mt, 60px);
}
</style>
