// Apoio visual do bloco "Adverbios de frequencia".
//
// Os verbos 1–100 têm recorte da folha do professor; os outros blocos não tinham
// imagem nenhuma. Em vez de baixar fotos de banco — peso no repositório, licença
// a conferir e nenhuma garantia de que a foto casa com a palavra — cada item
// ganha um emoji escolhido pelo sentido. Pesa zero e funciona offline.

export const EMOJIS_FREQUENCY: Record<number, string> = {
  1: '♾️', // always 100% = sem fim
  2: '🔋', // bateria quase cheia = 90%; par com o 🪫 de 5% (trocado: ⏰ só
  3: '📏', // normally = a régua, o padrão
  4: '📈', // often = alto na escala de frequência
  5: '🎲', // sometimes 50% = sai ou não sai
  6: '💎', // rarely = raro como pedra rara
  7: '🪫', // hardly ever = quase vazio, 5%
  8: '🚫', // never = zero, cortado
  9: '1️⃣', // once = uma vez
  10: '2️⃣', // twice = duas vezes
  11: '3️⃣', // three times = três vezes
  12: '📅', // once a week = uma marca na semana do calendário
  13: '🏖️', // on weekends = fim de semana
  14: '🦓', // listras alternadas = dia sim, dia não (trocado: 🔀 era a mes
  15: '🔁', // all the time = loop sem parar
  16: '❓', // how often = a pergunta que os outros 15 respondem
};
