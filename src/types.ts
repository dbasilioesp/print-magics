export type Magia = {
  Titulo: string
  TempoConj: string
  Alcance: string
  Componentes: string
  Duracao: string
  Escola: string
  Classes: string
  Descricao: string
  Material: string
}

export const RpgClasses = [
  'Bardo',
  'Bruxa',
  'Clériga',
  'Druida',
  'Feiticeira',
  'Ladino',
  'Paladina',
  'Guardião',
  'Mago',
]

export const Escolas = [
  'Abjuração',
  'Adivinhação',
  'Conjuração',
  'Encantamento',
  'Evocação',
  'Ilusão',
  'Necromancia',
  'Transmutação',
]

export type Classe = (typeof RpgClasses)[number]
export type Escola = (typeof Escolas)[number]

export type LibraryMagic = {
  title: string
  magics: Magia[]
  selecteds: Magia[]
}
