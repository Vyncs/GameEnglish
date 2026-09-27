// Apoio visual do bloco "Marcadores de tempo".
//
// Os verbos 1–100 têm recorte da folha do professor; os outros blocos não tinham
// imagem nenhuma. Em vez de baixar fotos de banco — peso no repositório, licença
// a conferir e nenhuma garantia de que a foto casa com a palavra — cada item
// ganha um emoji escolhido pelo sentido. Pesa zero e funciona offline.

export const EMOJIS_TIME_MARKERS: Record<number, string> = {
  1: '⏪', // um passo para trás no tempo; espelho do ⏩ de tomorrow
  2: '🔙', // o próprio letreiro BACK = "atrás", contado a partir de agora
  3: '😴', // a noite que você já dormiu — "Did you sleep well last night?
  4: '📅', // a página da semana no calendário, já riscada
  5: '📆', // a folha do mês arrancada: mês que fechou
  6: '🎂', // um ano = um aniversário, o bolo do ano que passou
  7: '📜', // ano fechado, já escrito no registro
  8: '☀️', // o dia de hoje, ainda em curso
  9: '🌃', // a noite de hoje, que ainda vai acontecer
  10: '🌅', // o nascer do sol = manhã de hoje
  11: '⏩', // um passo adiante: o dia seguinte
  12: '⏭️', // pula um bloco à frente = a semana seguinte
  13: '🔜', // SOON: mais longe que a semana, ainda perto = mês que vem
  14: '🎆', // a virada do ano = ano que vem
  15: '🔄', // o ciclo que repete todo dia (rotina)
  16: '🔴', // ao vivo, acontecendo agora
  17: '⏱️', // cronômetro disparado neste exato instante
  18: '▶️', // tocando, em andamento no momento
  19: '🆕', // novo, recente, sem data marcada
  20: '⚡', // num relâmpago: acabou de acontecer
  21: '✅', // já feito, tarefa marcada como concluída
  22: '❓', // o "já?" que fecha a pergunta
  23: '♾️', // alguma vez em toda a vida
  24: '📍', // o pino que marca o ponto de partida no tempo
  25: '⏳', // ampulheta: a duração que correu
};
