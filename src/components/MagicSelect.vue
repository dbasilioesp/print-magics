<script setup>
defineProps({
  magia: Object,
});

const selected = defineModel();
</script>

<template>
  <label class="magicCard">
    <h4 class="magicCard__title">{{ magia.Titulo }}</h4>
    <input type="checkbox" v-model="selected" :value="magia.Titulo" />
    <div class="magicCard__circle"></div>
  </label>
</template>

<style>
.magicCard {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 3px;
  background-color: gainsboro;

  input {
    visibility: hidden;
  }

  &:has(input:checked) {
    background-color: orange;
  }
}

.magicCard__title {
  font-weight: bold;
  font-size: 14px;
}

.magicCard__circle {
  width: 16px;
  height: 16px;
  background-color: white;
  border: 3px solid dimgray;
  border-radius: 50%;
}

.magicCard input:checked + .magicCard__circle {
  background-color: var(--orange);
  border-color: orange;
}
</style>
