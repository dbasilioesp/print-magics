<script setup>
import { useTemplateRef, watch } from "vue";

const el = useTemplateRef("dialog");
const magic = defineModel({ required: true });
const emit = defineEmits(["previous", "next"]);

watch(magic, (newValue) => {
  if (newValue) {
    el.value.showModal();
  }
});

const nextCardAnimation = (callback, reverse = false) => {
  const down = {
    opacity: 0,
    transform: "translate(50%, 100%) rotate(180deg)",
  };

  const start = {
    opacity: 0,
    transform: "translate(-50%, -100%) rotate(-180deg)",
  };

  const open = {
    opacity: 1,
    transform: "translate(0, 0) rotate(0deg)",
  };

  const timing = { duration: 400, fill: "forwards" };
  let animation;

  if (!reverse) {
    animation = el.value.animate([down], timing).onfinish = () => {
      callback();
      setTimeout(() => {
        animation = el.value.animate([start, open], timing).onfinish = () => {
          animation.cancel();
        };
      }, 100);
    };
  } else {
    animation = el.value.animate([start], timing).onfinish = () => {
      callback();
      setTimeout(() => {
        animation = el.value.animate([down, open], timing).onfinish = () => {
          animation.cancel();
        };
      }, 100);
    };
  }

  return animation;
};

const handleClick = (event) => {
  let rect = el.value.getBoundingClientRect();
  if (
    rect.left > event.clientX ||
    rect.right < event.clientX ||
    rect.top > event.clientY ||
    rect.bottom < event.clientY
  ) {
    el.value.close();
  }
};

const handleClose = () => {
  el.value.close();
  setTimeout(() => {
    magic.value = null;
  }, 500);
};

const navPrevious = () => {
  nextCardAnimation(() => {
    emit("previous");
  }, true);
};

const navNext = () => {
  nextCardAnimation(() => {
    emit("next");
  });
};
</script>

<template>
  <dialog class="dialog" ref="dialog" @click="handleClick" @close="handleClose">
    <div v-if="magic" class="dialog__wrap">
      <h1>{{ magic.Titulo }}</h1>
      <hr />
      <div class="dialog__head">
        <div><b>T.Conj</b>: {{ magic.TempoConj }}</div>
        <div><b>Alcance</b>: {{ magic.Alcance }}</div>
        <div><b>Componentes</b>: {{ magic.Componentes }}</div>
        <div><b>Duração</b>: {{ magic.Duracao }}</div>
      </div>
      <div class="dialog__desc">
        <p>{{ magic.Descricao }}</p>
        <div class="dialog__material" v-if="magic.Material">
          <b>Material</b>: {{ magic.Material }}
        </div>
      </div>
      <hr />
      <div class="dialog__footer">
        <div><b>Escola</b>: {{ magic.Escola }}</div>
        <div><b>Classes</b>: {{ magic.Classes }}</div>
      </div>

      <nav class="dialog__nav">
        <button type="button" class="dialog__navbutton" @click="navPrevious">
          Anterior
        </button>
        <button type="button" class="dialog__navbutton" @click="navNext">
          Próximo
        </button>
      </nav>
    </div>
  </dialog>
</template>

<style>
.dialog {
  font-family: "Domine";
  margin: auto;
  border: 0;
  border-radius: 4px;
  max-width: 500px;
  margin: auto;
  padding: 10px 20px 20px;
  box-shadow: var(--lightDropShadow);
  transition: opacity 0.5s ease-in-out, translate 0.5s ease-in-out,
    rotate 0.5s ease-in-out, overlay 0.5s allow-discrete,
    display 0.5s allow-discrete;

  /* Close state */
  opacity: 0;
  translate: 50% 100%;
  rotate: 180deg;

  /* Idle State */
  &[open] {
    opacity: 1;
    translate: 0 0;
    rotate: 0deg;
  }

  &::backdrop {
    transition: display 0.5s allow-discrete, overlay 0.5s allow-discrete,
      background-color 0.5s;
    background-color: hsl(0 0 0 / 0);
  }

  &[open]::backdrop {
    background-color: hsl(0 0 0 / 50%);
  }
}

@starting-style {
  /* Start State */
  .dialog {
    &[open] {
      opacity: 0;
      translate: -50% -100%;
      rotate: -180deg;
    }

    &::backdrop {
      background-color: hsl(0 0 0 / 50%);
    }
  }
}

.dialog__nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.dialog__navbutton {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  font-size: 14px;
  padding: 4px 16px;
  border: 0;
  cursor: pointer;
  background-color: hsl(39, 33%, 92%);

  &:is(:hover, :focus) {
    background-color: hsl(42, 8%, 75%);
  }
}

.dialog__head {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  margin-bottom: 10px;
  font-size: 14px;
  margin-top: 20px;
}

.dialog__desc {
  font-family: var(--fontDisplay);
  font-size: 15px;
  margin-bottom: 10px;
}

.dialog__desc p {
  font-family: var(--fontDisplay);
  line-height: 1.6;
}

.dialog__material {
  margin-top: 10px;
}

.dialog__footer {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 14px;
}
</style>
