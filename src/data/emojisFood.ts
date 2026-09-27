// Apoio visual do bloco "Comida e bebida".
//
// Os verbos 1–100 têm recorte da folha do professor; os outros blocos não tinham
// imagem nenhuma. Em vez de baixar fotos de banco — peso no repositório, licença
// a conferir e nenhuma garantia de que a foto casa com a palavra — cada item
// ganha um emoji escolhido pelo sentido. Pesa zero e funciona offline.

export const EMOJIS_FOOD: Record<number, string> = {
  1: '🥞', // panqueca: prato de café da manhã, sem colidir com 🍞 nem 🥚
  2: '🍱', // marmita: a refeição do meio do dia
  3: '🍝', // prato quente servido à noite; troquei o 🍽️ porque é o emoji
  4: '🍲', // panela de comida: refeição em geral, distinta dos três horár
  5: '🥩', // corte de carne, direto
  6: '🐔', // galinha cobre animal e carne, como o tip explica
  7: '🐟', // peixe, direto
  8: '🍚', // tigela de arroz cozido
  9: '🫘', // feijões no plural, como a palavra sempre é em inglês
  10: '🍞', // pão de forma, o desenho mais óbvio de bread
  11: '🧀', // queijo, direto
  12: '🥚', // ovo inteiro, contável: one egg / two eggs
  13: '🍎', // maçã: a fruta protótipo do grupo
  14: '🥦', // brócolis: verdura, sem ambiguidade com fruit
  15: '🧂', // saleiro
  16: '🍬', // bala: doce/açúcar; não existe emoji de açúcar e contrasta co
  17: '💧', // gota de água, incontável como a palavra
  18: '🧃', // caixinha de suco com canudo
  19: '🥤', // copo sem álcool: bebida em geral; 🍹 reforçaria o falso amig
  20: '👅', // língua: onde o sabor acontece, provar
  21: '🤤', // boca d'água: vontade de comer, e hungry é sensação
  22: '🏜️', // deserto: sede, sem repetir água nem bebida
  23: '📝', // bloquinho onde o pedido é anotado; a nota final é o 🧾 do it
  24: '🤵', // traje formal: garçom servindo, sem modificador de tom de pel
  25: '🧾', // cupom fiscal: a conta pedida no fim
};
