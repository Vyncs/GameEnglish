import type { Topic } from './topic';

// Tópico: 25 palavras de viagem — aeroporto, hotel e deslocamento.
// Sem passado/particípio → não usa a etapa "Formas".

export const TOPIC_TRAVEL: Topic = {
  id: 'travel-01-25',
  title: 'Viagem e transporte',
  subtitle: 'trip → abroad',
  emoji: '✈️',
  category: 'cotidiano',
  level: 2,
  stages: ['study', 'meaning'],
  items: [
    { id: 1, base: 'trip', pt: 'viagem (a ida e volta)', example: 'We took a trip to Chile.', tip: 'Trip é a viagem concreta; travel é o ato de viajar em geral.' },
    { id: 2, base: 'travel', pt: 'viajar', example: 'I travel for work.', tip: 'Como substantivo é incontável: nunca "a travel". Use "a trip".' },
    { id: 3, base: 'flight', pt: 'voo', example: 'My flight is at six.', tip: 'O "gh" é mudo: "flait".' },
    { id: 4, base: 'airport', pt: 'aeroporto', example: 'I will meet you at the airport.', tip: 'air + port. Aeromoça/comissário = "flight attendant".' },
    { id: 5, base: 'ticket', pt: 'passagem, bilhete, ingresso', example: 'I bought two tickets.', tip: 'Serve para avião, cinema e multa de trânsito.' },
    { id: 6, base: 'luggage', pt: 'bagagem', example: 'Where is my luggage?', tip: 'Incontável: nunca "luggages". Uma mala = "a suitcase" ou "a bag".' },
    { id: 7, base: 'suitcase', pt: 'mala', example: 'My suitcase is heavy.', tip: 'suit (terno) + case (caixa) — a caixa onde cabia o terno.' },
    { id: 8, base: 'passport', pt: 'passaporte', example: 'Show me your passport, please.', tip: 'Documento de identidade genérico é "ID".' },
    { id: 9, base: 'hotel', pt: 'hotel', example: 'We stayed at a nice hotel.', tip: 'Hospedar-se usa "stay at", não "sleep in".' },
    { id: 10, base: 'book', pt: 'reservar; livro', example: 'I booked a room for two nights.', tip: 'Como verbo é reservar — nada a ver com ler um livro.' },
    { id: 11, base: 'check in', pt: 'fazer o check-in', example: 'We check in at three.', tip: 'A saída é "check out". Como substantivo escreve-se junto: "the check-in".' },
    { id: 12, base: 'abroad', pt: 'no exterior', example: 'She lives abroad.', tip: 'Advérbio: nunca "in abroad". Diga "go abroad".' },
    { id: 13, base: 'delay', pt: 'atraso', example: 'There was a long delay.', tip: 'Atrasado (pessoa) é "late"; atraso de voo é "delay".' },
    { id: 14, base: 'arrive', pt: 'chegar', example: 'We arrived at midnight.', tip: 'Cidade/país usa "in"; lugar específico usa "at": arrive in Brazil, arrive at the hotel.' },
    { id: 15, base: 'leave', pt: 'partir, sair; deixar', example: 'The bus leaves at eight.', tip: 'Passado: left. "Leave home" = sair de casa; "leave it here" = deixe aqui.' },
    { id: 16, base: 'train', pt: 'trem', example: 'I take the train every day.', tip: 'Pegar transporte é "take", não "catch" (embora catch valha para não perder).' },
    { id: 17, base: 'bus', pt: 'ônibus', example: 'The bus is late.', tip: 'Ponto de ônibus = "bus stop"; rodoviária = "bus station".' },
    { id: 18, base: 'subway', pt: 'metrô', example: 'The subway is faster.', tip: 'No britânico é "the Tube" ou "underground". Subway também é uma passagem subterrânea.' },
    { id: 19, base: 'drive', pt: 'dirigir', example: 'I drive to work.', tip: 'Passado: drove. Particípio: driven. Motorista = "driver".' },
    { id: 20, base: 'road', pt: 'estrada, rua', example: 'The road is closed.', tip: 'Rua da cidade é "street"; rodovia grande é "highway".' },
    { id: 21, base: 'map', pt: 'mapa', example: 'Look at the map.', tip: 'Falso amigo fácil: map é mapa, não "mapa mental" (mind map).' },
    { id: 22, base: 'far', pt: 'longe', example: 'Is it far from here?', tip: 'Distância se pergunta com "How far is it?".' },
    { id: 23, base: 'near', pt: 'perto', example: 'The hotel is near the beach.', tip: 'Não precisa de "to": "near the beach", não "near to the beach".' },
    { id: 24, base: 'lost', pt: 'perdido', example: 'I think we are lost.', tip: 'Usa BE: "I am lost", não "I have lost" (que pediria um objeto).' },
    { id: 25, base: 'beach', pt: 'praia', example: 'We went to the beach.', tip: 'Cuidado com a pronúncia: o "ea" é longo, "biitch" curto soa como xingamento.' },
  ],
};
