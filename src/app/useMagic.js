import { ref, computed } from "vue";

import truques from "@/magias/truques";
import nivel1 from "@/magias/nivel1";
import nivel2 from "@/magias/nivel2";

export const rpgClasses = [
  "Bardo",
  "Bruxa",
  "Clériga",
  "Druida",
  "Feiticeira",
  "Ladino",
  "Paladina",
  "Guardião",
  "Mago",
];

export const schools = [
  "Abjuração",
  "Adivinhação",
  "Conjuração",
  "Encantamento",
  "Evocação",
  "Ilusão",
  "Necromancia",
  "Transmutação",
];

export function useMagic() {
  const selectedMagics = ref([]);
  const selectedClass = ref("");
  const selectedSchool = ref("");

  const allMagics = computed(() => {
    let truquesFil = truques;
    let nivel1Fil = nivel1;
    let nivel2Fil = nivel2;

    if (selectedClass.value && selectedClass.value != "-") {
      const fnFilter = (i) => i.Classes.includes(selectedClass.value);
      truquesFil = truques.filter(fnFilter);
      nivel1Fil = nivel1.filter(fnFilter);
      nivel2Fil = nivel2.filter(fnFilter);
    }

    if (selectedSchool.value && selectedSchool.value != "-") {
      const fnFilter = (i) => i.Escola.includes(selectedSchool.value);
      truquesFil = truques.filter(fnFilter);
      nivel1Fil = nivel1.filter(fnFilter);
      nivel2Fil = nivel2.filter(fnFilter);
    }

    const fnSelected = (i) => selectedMagics.value.includes(i.Titulo);

    return [
      {
        title: "Truques",
        magics: truquesFil,
        selecteds: truques.filter(fnSelected),
      },
      {
        title: "Nivel 1°",
        magics: nivel1Fil,
        selecteds: nivel1.filter(fnSelected),
      },
      {
        title: "Nivel 2°",
        magics: nivel2Fil,
        selecteds: nivel2.filter(fnSelected),
      },
    ];
  });

  return {
    selectedClass,
    selectedMagics,
    selectedSchool,
    allMagics,
  };
}
