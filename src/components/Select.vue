<script setup lang="ts">
import { ref, useTemplateRef, computed, onMounted, onUnmounted } from 'vue'

type Item = {
  label: string
  value: string
}

type Props = {
  name: string
  items: Item[]
  loading?: boolean
  queryable?: boolean
  disabled?: boolean
  placeholder: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Selecione',
  loading: false,
  queryable: false,
  disabled: false,
})

const model = defineModel<string | number>({ required: true })

const el = useTemplateRef('el')
const opened = ref(false)
const query = ref('')
const timer = ref(false)

function setDefaultQuery() {
  const item = props.items.find((i) => i.value == model.value)
  query.value = item ? item.label : ''
}

function closeOutsideClick(e: Event) {
  if (!el.value?.contains(e.target as HTMLElement)) {
    opened.value = false
    setDefaultQuery()
  }
}

function handleFocus() {
  if (props.disabled) return

  if (props.queryable && !timer.value) {
    query.value = ''
    opened.value = true
  } else {
    opened.value = !opened.value
  }
}

function selectItem(item: Item) {
  opened.value = false
  timer.value = true
  query.value = item.label
  model.value = item.value
  setTimeout(() => (timer.value = false), 300)
}

const results = computed(() => {
  if (!props.queryable) return props.items
  if (!query.value.trim()) return props.items

  let q = query.value.trim()
  const regex = /[.&()]/gi
  q = q.replaceAll(regex, '')
  const r = new RegExp(q, 'gi')

  return props.items.filter((i) => {
    let label = i.label.trim().replaceAll(regex, '')
    return r.test(label)
  })
})

const label = computed(() => {
  if (props.loading) {
    return 'Carregando'
  }
  if (model.value != undefined && model.value != null) {
    const item = props.items.find((i) => {
      return i.value.toString().trim() == model.value.toString().trim()
    })
    return item ? item.label : props.placeholder
  }

  return props.placeholder
})

onMounted(() => {
  if (model.value) {
    setDefaultQuery()
  }
  window.addEventListener('click', closeOutsideClick)
})

onUnmounted(() => {
  window.removeEventListener('click', closeOutsideClick)
})
</script>

<template>
  <div class="select" :class="[{ input_blocked: disabled, opened }]" ref="el">
    <div class="select__button">
      <input
        v-if="queryable"
        type="text"
        :key="'input'"
        class="select__input"
        v-model="query"
        @focus="handleFocus"
        @click="handleFocus"
        :disabled="disabled"
        :placeholder="label"
      />
      <button v-else type="button" for="select" @click="handleFocus" :title="label">
        {{ label }}
      </button>
      <input type="hidden" :name="name" v-model="model" />
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
        class="select__arrow feather feather-chevron-down"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </div>

    <div class="select__dropdown">
      <div class="select__options">
        <button
          type="button"
          v-if="results.length > 0"
          v-for="item in results"
          :key="item.value"
          class="select__optionButton"
          :class="{ selected: model == item.value }"
          @click="selectItem(item)"
        >
          {{ item.label }}
        </button>
        <span class="select__emptyMessage" v-else> Nenhuma opção encontrada </span>
      </div>
    </div>
  </div>
</template>

<style>
.select {
  --font: var(--fontTitle);
  --height: 40px;

  position: relative;
  min-width: 250px;

  .select,
  input,
  .items {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.select__button {
  display: flex;
  align-items: center;
  gap: 8px;

  height: var(--height);
  padding: 10px 34px 10px 10px;
  border-radius: 5px;

  button,
  input {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    padding: inherit;
    border: 0;
    width: 100%;
    height: 100%;
    text-align: left;
    background-color: #f3f4f6;
    border-radius: inherit;
    font-family: var(--font);
    font-weight: 500;
  }
}

.select__arrow {
  position: absolute;
  right: 5px;
  top: 50%;
  translate: 0 -50%;
  transition: all 300ms;
  pointer-events: none;
}

.select.opened .select__arrow {
  rotate: 180deg;
}

.select__dropdown {
  position: absolute;
  width: 100%;
  top: calc(100% + 40px);
  z-index: -1;
  opacity: 0;
  transition: all 300ms;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  padding-block: 10px;
  border-radius: 3px;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.select.opened .select__dropdown {
  top: calc(100% + 1px);
  opacity: 1;
  z-index: 10;
}

.select__options {
  max-height: 150px;
  overflow: auto;
  scrollbar-width: thin;
  white-space: nowrap;
  font-size: 14px;
  text-overflow: ellipsis;
}

.select__optionButton {
  background-color: transparent;
  display: flex;
  align-items: center;
  height: 30px;
  font-size: 14px;
  border: 0;
  width: 100%;
  padding-inline: 10px;
  font-family: var(--font);
}

.select__optionButton:hover {
  background-color: #f1f1f1;
}

.select__emptyMessage {
  font-size: 14px;
  display: block;
  padding: 3px 12px;
  color: #b1b1b1;
}
</style>
