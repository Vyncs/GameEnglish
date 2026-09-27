// Apoio visual do bloco "Corpo e saude".
//
// Os verbos 1–100 têm recorte da folha do professor; os outros blocos não tinham
// imagem nenhuma. Em vez de baixar fotos de banco — peso no repositório, licença
// a conferir e nenhuma garantia de que a foto casa com a palavra — cada item
// ganha um emoji escolhido pelo sentido. Pesa zero e funciona offline.

export const EMOJIS_HEALTH: Record<number, string> = {
  1: '🧠', // órgão que fica dentro da cabeça — não existe emoji só de cab
  2: '🙂', // rosto inteiro, neutro
  3: '👁️', // olho no singular, igual à palavra
  4: '👂', // orelha, serve também para ouvido/audição
  5: '👄', // boca — 'open your mouth'
  6: '🦷', // dente literal
  7: '💇', // cabelo sendo cortado
  8: '✋', // mão aberta, sem gesto ambíguo
  9: '💪', // braço flexionado
  10: '🦵', // perna literal
  11: '🦶', // pé literal, distinto da perna
  12: '🙇', // pessoa curvada, as costas à mostra — 'my back hurts' (a seta
  13: '🤢', // mal do estômago — 'I have a stomach ache'
  14: '🫀', // coração anatômico, o órgão que bate
  15: '🤒', // cara de doente — 'I am sick today'
  16: '😖', // careta de quem sente dor
  17: '🤕', // machucado com faixa, dor de pancada
  18: '🌡️', // termômetro marcando febre
  19: '😮‍💨', // ar saindo pela boca, o mais perto de tossir
  20: '🤧', // resfriado com lencinho
  21: '💊', // comprimido de remédio
  22: '🧑‍⚕️', // profissional de saúde, sem gênero
  23: '🏥', // prédio do hospital
  24: '🥗', // comida saudável, igual ao exemplo
  25: '📅', // horário marcado na agenda
};
