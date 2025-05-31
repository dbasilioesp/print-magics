import { ref, computed, type Ref } from 'vue'

import truques from '@/magias/truques'
import nivel1 from '@/magias/nivel1'
import nivel2 from '@/magias/nivel2'
import type { Classe, Escola, LibraryMagic, Magia } from '@/types'

export function useMagic() {
  const selectedMagics = ref<string[]>([])
  const selectedClass = ref<Classe>('')
  const selectedSchool = ref<Escola>('')

  const allMagics: Ref<LibraryMagic[]> = computed(() => {
    let truquesFil = truques as Magia[]
    let nivel1Fil = nivel1 as Magia[]
    let nivel2Fil = nivel2 as Magia[]

    if (selectedClass.value && selectedClass.value != '-') {
      const fnFilter = (i: Magia) => i.Classes.includes(selectedClass.value)
      truquesFil = truques.filter(fnFilter)
      nivel1Fil = nivel1.filter(fnFilter)
      nivel2Fil = nivel2.filter(fnFilter)
    }

    if (selectedSchool.value && selectedSchool.value != '-') {
      const fnFilter = (i: Magia) => i.Escola.includes(selectedSchool.value)
      truquesFil = truques.filter(fnFilter)
      nivel1Fil = nivel1.filter(fnFilter)
      nivel2Fil = nivel2.filter(fnFilter)
    }

    const fnSelected = (i: Magia) => selectedMagics.value.includes(i.Titulo)

    const r: LibraryMagic[] = [
      {
        title: 'Truques',
        magics: truquesFil,
        selecteds: truques.filter(fnSelected),
      },
      {
        title: 'Nivel 1°',
        magics: nivel1Fil,
        selecteds: nivel1.filter(fnSelected),
      },
      {
        title: 'Nivel 2°',
        magics: nivel2Fil,
        selecteds: nivel2.filter(fnSelected),
      },
    ]

    return r
  })

  return {
    selectedClass,
    selectedMagics,
    selectedSchool,
    allMagics,
  }
}
