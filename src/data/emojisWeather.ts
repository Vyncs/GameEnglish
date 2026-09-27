// Apoio visual do bloco "Clima e tempo".
//
// Os verbos 1–100 têm recorte da folha do professor; os outros blocos não tinham
// imagem nenhuma. Em vez de baixar fotos de banco — peso no repositório, licença
// a conferir e nenhuma garantia de que a foto casa com a palavra — cada item
// ganha um emoji escolhido pelo sentido. Pesa zero e funciona offline.

export const EMOJIS_WEATHER: Record<number, string> = {
  1: '🌦️', // sol e chuva no mesmo ceu = o tempo/clima em geral
  2: '☀️', // o sol puro, o substantivo
  3: '🌞', // sol radiante com rosto: variante que marca o adjetivo, sem r
  4: '🌧️', // nuvem soltando chuva
  5: '☔', // guarda-chuva ABERTO sob gotas = dia chuvoso (o fechado ficou
  6: '☁️', // a nuvem sozinha
  7: '⛅', // ceu tomado pela nuvem = nublado, distinto da nuvem sozinha
  8: '💨', // rajada de ar, o vento
  9: '🪁', // pipa so voa com vento = dia ventoso
  10: '❄️', // floco de neve
  11: '⛈️', // nuvem com chuva e raio = tempestade
  12: '🌩️', // nuvem estourando (sem chuva): o trovao vem da nuvem; 🔊 era 
  13: '⚡', // o clarao do raio, sem nuvem
  14: '🌫️', // faixas de neblina
  15: '🌌', // cena de ceu aberto, sem confundir com tempo/clima
  16: '💧', // gota de agua sobre a coisa = molhado; evita a leitura sexual
  17: '🏜️', // deserto = seco, oposto visual de molhado
  18: '♨️', // vapor morno: calor agradavel, nao o fogo de 'hot'
  19: '🧊', // gelo = temperatura fresca, sem cair na familia do vento
  20: '🌂', // guarda-chuva FECHADO, o objeto em si; o aberto com chuva fic
  21: '🌡️', // termometro = graus, temperatura
  22: '🔮', // bola de cristal = prever, previsao; 📺 lembrava televisao, n
  23: '🏖️', // praia = verao
  24: '⛄', // boneco de neve = inverno, distinto do floco de 'snow'
  25: '🍂', // folhas caidas = outono
};
