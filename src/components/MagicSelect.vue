<script setup>
import { computed } from "vue";

const props = defineProps({
  magia: Object,
});

const model = defineModel({ type: Array });

const emit = defineEmits(["info"]);

const toggleSelected = () => {
  if (model.value.includes(props.magia.Titulo)) {
    model.value = model.value.filter((item) => item !== props.magia.Titulo);
  } else {
    model.value.push(props.magia.Titulo);
  }
};

const selected = computed(() => model.value.includes(props.magia.Titulo));
</script>

<template>
  <div class="magicCard" :class="{ selected }" @mouseout="$event.target.blur()">
    <span class="magicCard__title">{{ magia.Titulo }}</span>
    <div class="magicCard__buttons">
      <div class="magicCard__indicator">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </div>
      <button class="magicCard__button" type="button" @click="toggleSelected">
        <svg
          v-if="!selected"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>

        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </button>
      <button
        class="magicCard__button"
        type="button"
        @click="$emit('info', magia)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
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
}

.magicCard__buttons {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  height: 100%;
  width: 18px;
  transition: all 0.3s ease;
  z-index: 1;

  button {
    opacity: 0;
    transition: opacity 0.8s ease;
  }
}

.magicCard:is(:hover, :focus-within, .selected) {
  outline: 2px solid var(--bg-button-two);
}

.magicCard:is(:hover, :focus-within) .magicCard__buttons {
  width: 80px;

  button {
    opacity: 1;
  }
}

.magicCard__indicator {
  position: absolute;
  right: 0px;
  top: 50%;
  translate: 0 -50%;
  width: 20px;
  height: 20px;
  transition: right 0.3s ease;
  z-index: 0;
}

.magicCard:hover .magicCard__indicator {
  right: -20px;
  opacity: 0;
  width: 0;
}

.magicCard__button {
  width: 40px;
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
