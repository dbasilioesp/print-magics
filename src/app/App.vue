<script setup>
import "@/assets/styles/style.css";

import MagicList from "@/components/MagicList.vue";
import InputSelect from "@/components/Select.vue";
import { useMagicPDF } from "./useMagicPDF";

const { selectedMagics, selectedClass, rpgClasses, generatePDF, allMagics } =
  useMagicPDF();

const classOptions = [
  { label: "Todas classes", value: "-" },
  ...rpgClasses.map((item) => ({ label: item, value: item })),
];
</script>

<template>
  <section class="article">
    <h1>Magias</h1>

    <div>
      <div class="page__filterPanel">
        <InputSelect
          v-model="selectedClass"
          :items="classOptions"
          placeholder="Filtrar por classe"
        />
        <button type="button" class="button" @click="generatePDF">
          Gerar PDF
        </button>
        <button
          type="button"
          class="page__buttonSelecteds button isOutline"
          onclick="magicsSidebar.showModal()"
        >
          Ver Selecionados
        </button>
      </div>

      <div class="magicsGrid">
        <div class="magicsList">
          <MagicList
            :label="magicNivel.title"
            v-model="selectedMagics"
            :magics="magicNivel.magics"
            v-for="magicNivel in allMagics"
            :key="magicNivel.label"
          />
        </div>

        <dialog id="magicsSidebar" class="magicsSidebar">
          <button
            class="magicsSidebar__buttonClose"
            type="button"
            onclick="magicsSidebar.close()"
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div class="magicsSidebar__wrap">
            <h2>Selecionados:</h2>
            <template v-for="magicNivel in allMagics" :key="magicNivel.label">
              <div v-if="magicNivel.selecteds.length > 0">
                <h3>{{ magicNivel.title }}</h3>
                <div v-for="magic in magicNivel.selecteds" :key="magic.Titulo">
                  {{ magic.Titulo }}
                </div>
              </div>
            </template>
          </div>
        </dialog>
      </div>
    </div>
  </section>
</template>

<style scoped>
.article {
  max-width: 1280px;
  width: 100%;
  margin-inline: auto;
  padding-bottom: 100px;
}

.page__filterPanel {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;

  select {
    width: auto;
  }
}

.page__buttonSelecteds {
  @media (min-width: 601px) {
    display: none;
  }
}

.magicsGrid {
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.magicsSidebar {
  border-radius: 4px;
  background-color: #2a3140;
  color: white;
  max-height: 600px;
  padding: 10px 2px 0 10px;

  h2 {
    margin-inline: 0;
    margin-block: 4px;
  }

  &[open] {
    left: 50%;
    top: 50%;
    translate: -50% -50%;
    height: 100%;
    max-width: 400px;
    width: 100%;
    padding: 16px 2px 0 20px;

    @media (max-width: 420px) {
      max-width: 100%;
      max-height: 100%;
      width: calc(100% - 60px);
      height: calc(100% - 60px);
    }
  }

  @media (min-width: 601px) {
    position: static;
    display: flex;
    width: 100%;
    height: 100%;
  }
}

.magicsSidebar__wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 10px;
  width: 100%;

  overflow: auto;
  /* max-height: 100%; */
  scrollbar-width: thin;
  scrollbar-color: white #2a3140;
}

.magicsSidebar__buttonClose {
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: none;
  border: 0;
  display: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  padding: 0;
}

.magicsSidebar[open] .magicsSidebar__buttonClose {
  display: block;
}

.debug {
  position: fixed;
  z-index: 1;
  left: 20px;
  bottom: 40px;
  width: 600px;
  font-size: 11px;

  text-overflow: ellipsis;
  overflow: auto;
  height: 100px;
  background-color: white;
  border-radius: 4px;
  padding: 10px;
}
</style>
