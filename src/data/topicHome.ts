import type { Topic } from './topic';

// Tópico: 25 palavras de casa — cômodos, móveis e o que se usa todo dia.
// Sem passado/particípio → não usa a etapa "Formas".

export const TOPIC_HOME: Topic = {
  id: 'home-01-25',
  title: 'Casa e móveis',
  subtitle: 'house → rent · 25 palavras',
  emoji: '🏠',
  category: 'cotidiano',
  level: 1,
  stages: ['study', 'meaning'],
  items: [
    { id: 1, base: 'house', pt: 'casa (o prédio)', example: 'They bought a new house.', tip: 'House é a construção; home é onde você mora, com o sentido de lar.' },
    { id: 2, base: 'home', pt: 'casa, lar', example: 'I am going home.', tip: 'Com home não se usa "to": "go home", nunca "go to home".' },
    { id: 3, base: 'apartment', pt: 'apartamento', example: 'She lives in a small apartment.', tip: 'No inglês britânico é "flat".' },
    { id: 4, base: 'room', pt: 'quarto, cômodo', example: 'This room is very big.', tip: 'Serve para qualquer cômodo. O quarto de dormir é "bedroom".' },
    { id: 5, base: 'bedroom', pt: 'quarto de dormir', example: 'The house has three bedrooms.', tip: 'Anúncios de imóvel contam bedrooms, não rooms.' },
    { id: 6, base: 'kitchen', pt: 'cozinha', example: 'He is cooking in the kitchen.', tip: 'Não confunda com "chicken" (frango) — KIT-chen × CHIK-en.' },
    { id: 7, base: 'bathroom', pt: 'banheiro', example: 'Where is the bathroom?', tip: 'Em lugar público também se diz "restroom" ou "toilet".' },
    { id: 8, base: 'living room', pt: 'sala de estar', example: 'We watch TV in the living room.', tip: 'Duas palavras. A sala de jantar é "dining room".' },
    { id: 9, base: 'floor', pt: 'chão; andar', example: 'I live on the third floor.', tip: 'Duas traduções. Andar usa "on": on the third floor.' },
    { id: 10, base: 'wall', pt: 'parede', example: 'The picture is on the wall.', tip: 'Parede e muro são a mesma palavra.' },
    { id: 11, base: 'door', pt: 'porta', example: 'Please close the door.', tip: 'Bater na porta = "knock on the door".' },
    { id: 12, base: 'window', pt: 'janela', example: 'Open the window, please.', tip: 'Pronuncia-se "UIN-dou".' },
    { id: 13, base: 'key', pt: 'chave', example: 'I lost my keys.', tip: 'Também é a tecla do teclado e a chave de um problema.' },
    { id: 14, base: 'table', pt: 'mesa', example: 'Put it on the table.', tip: 'Mesa de trabalho é "desk".' },
    { id: 15, base: 'chair', pt: 'cadeira', example: 'Take a chair.', tip: 'Poltrona = "armchair"; sofá = "couch" ou "sofa".' },
    { id: 16, base: 'bed', pt: 'cama', example: 'I go to bed at eleven.', tip: '"Go to bed" é ir dormir; "go to the bed" seria andar até o móvel.' },
    { id: 17, base: 'fridge', pt: 'geladeira', example: 'The milk is in the fridge.', tip: 'Forma curta de "refrigerator" — fridge é o que se fala.' },
    { id: 18, base: 'stove', pt: 'fogão', example: 'Turn off the stove.', tip: 'O forno separado é "oven" (pronuncia-se "Â-ven").' },
    { id: 19, base: 'sink', pt: 'pia', example: 'The dishes are in the sink.', tip: 'Como verbo significa afundar: the boat sank.' },
    { id: 20, base: 'towel', pt: 'toalha', example: 'I need a clean towel.', tip: 'Toalha de mesa é "tablecloth", não towel.' },
    { id: 21, base: 'clean', pt: 'limpo; limpar', example: 'The kitchen is clean.', tip: 'Adjetivo e verbo. Faxina geral = "clean up".' },
    { id: 22, base: 'dirty', pt: 'sujo', example: 'My shoes are dirty.', tip: 'Oposto de clean.' },
    { id: 23, base: 'garbage', pt: 'lixo', example: 'Take out the garbage.', tip: 'No inglês britânico é "rubbish"; a lixeira é "bin" ou "trash can".' },
    { id: 24, base: 'neighbor', pt: 'vizinho', example: 'My neighbor is very nice.', tip: 'O "gh" é mudo: "NEI-bor". No britânico escreve-se "neighbour".' },
    { id: 25, base: 'rent', pt: 'aluguel; alugar', example: 'The rent is too high.', tip: 'Substantivo e verbo. Alugar para alguém = "rent out".' },
  ],
};
