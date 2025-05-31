<script setup lang="ts">
import { computed } from 'vue'
import type { Magia } from '@/types'
import { FiPlusCircle, FiXCircle, FiBookOpen, FiChevronDown } from 'vue-icons-plus/fi'

type Props = {
  magia: Magia
}

const props = defineProps<Props>()

const model = defineModel<string[]>({ required: true })

const emit = defineEmits(['info'])

const toggleSelected = () => {
  if (model.value.includes(props.magia.Titulo)) {
    model.value = model.value.filter((item) => item !== props.magia.Titulo)
  } else {
    model.value.push(props.magia.Titulo)
  }
}

const selected = computed(() => model.value.includes(props.magia.Titulo))
</script>

<template>
  <div class="magicCard" :class="{ selected }" @mouseout="$event.target?.blur()">
    <span class="magicCard__title">{{ magia.Titulo }}</span>
    <div class="magicCard__buttons">
      <div class="magicCard__indicator">
        <FiChevronDown />
      </div>
      <button
        title="Imprimir"
        aria-label="Imprimir"
        class="magicCard__button"
        type="button"
        @click="toggleSelected"
      >
        <FiPlusCircle v-if="!selected" />
        <FiXCircle v-else />
      </button>
      <button
        title="Visualizar"
        aria-label="Visualizar"
        class="magicCard__button"
        type="button"
        @click="$emit('info', magia)"
      >
        <FiBookOpen />
      </button>
    </div>
  </div>
</template>

<style>
.magicCard {
  --bg-card: #f4d8cd;
  --bg-button-one: #edb183;
  --bg-button-two: #f15152;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-left: 10px;
  height: 40px;
  border-radius: 3px;
  background-color: var(--bg-card);
  cursor: pointer;
  user-select: none;
  border-radius: 3px;
  overflow: hidden;
}

.magicCard__title {
  font-weight: bold;
  font-size: 14px;
  line-height: 1;
}

.magicCard__buttons {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  height: 100%;
  width: 18px;
  transition: all 0.3s ease-out;
  z-index: 1;

  button {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  }
}

.magicCard:is(:hover, :focus-within, .selected) {
  outline: 2px solid var(--bg-button-two);
}

.magicCard:is(:hover, :focus-within) .magicCard__buttons {
  width: 100px;

  button {
    opacity: 1;
  }
}

.magicCard__indicator {
  position: absolute;
  right: 2px;
  top: 50%;
  translate: 0 -50%;
  width: 20px;
  height: 20px;
  transition: right 0.3s ease;
  z-index: 0;
}

.magicCard:hover .magicCard__indicator {
  right: -30px;
  opacity: 0;
  width: 0;
}

.magicCard__button {
  width: 50px;
  height: 100%;
  background-color: var(--bg-button);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border: 0;

  svg {
    width: 18px;
    height: 18px;
  }
}

.magicCard__button:nth-child(2) {
  background-color: var(--bg-button-one);
}

.magicCard__button:last-child {
  background-color: var(--bg-button-two);
}
</style>
