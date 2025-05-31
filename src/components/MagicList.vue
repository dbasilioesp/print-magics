<script setup lang="ts">
import { ref } from "vue";
import MagicSelect from "./MagicSelect.vue";
import DialogMagicInfo from "./DialogMagicInfo.vue";
import type { Magia } from "@/types";

interface Props {
  label: string;
  magics: Magia[];
}

const selectedMagics = defineModel();

const props = defineProps<Props>();

defineEmits<{
  all: [];
  clear: [];
}>();

const magicInfo = ref<Magia | null>(null);

const openModal = (magic: Magia) => {
  magicInfo.value = magic;
};

const handleNext = () => {
  const index = props.magics.findIndex(
    (magic) => magicInfo.value?.Titulo == magic.Titulo
  );
  const nextIndex = index + 1;
  if (props.magics[nextIndex]) {
    magicInfo.value = props.magics[nextIndex];
  } else {
    magicInfo.value = props.magics[0];
  }
};

const handlePrevious = () => {
  const index = props.magics.findIndex(
    (magic) => magicInfo.value.Titulo == magic.Titulo
  );
  const prevIndex = index - 1;
  if (props.magics[prevIndex]) {
    magicInfo.value = props.magics[prevIndex];
  } else {
    magicInfo.value = props.magics[props.magics.length - 1];
  }
};
</script>

<template>
  <section class="mList">
    <div class="mList__header">
      <h3 class="mList__title" v-if="magics.length">{{ label }}</h3>
      <div class="mList__headerButtons">
        <button
          type="button"
          class="button isOption isExtraSmall"
          @click="$emit('all')"
        >
          Todos
        </button>
        <button
          type="button"
          class="button isOption isExtraSmall"
          @click="$emit('clear')"
        >
          Limpar
        </button>
      </div>
    </div>
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
  </section>
</template>

<style scoped>
.mList__header {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
}

.mList__headerButtons {
  display: flex;
  gap: 0.5rem;
}

.mList__title {
  margin: 0;
}

.rollGrid {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, minmax(var(--min, 150px), 1fr));
  gap: 8px 8px;
  margin-top: var(--mt, 60px);
}
</style>
