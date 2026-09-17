import type { Topic } from './topic';

// Tópico: 25 palavras de corpo e saúde — o que se diz no médico e na farmácia.
// Sem passado/particípio → não usa a etapa "Formas".

export const TOPIC_HEALTH: Topic = {
  id: 'health-01-25',
  title: 'Corpo e saúde',
  subtitle: 'head → appointment · 25 palavras',
  emoji: '🩺',
  category: 'cotidiano',
  level: 2,
  stages: ['study', 'meaning'],
  items: [
    { id: 1, base: 'head', pt: 'cabeça', example: 'My head hurts.', tip: 'Dor de cabeça tem palavra própria: "headache".' },
    { id: 2, base: 'face', pt: 'rosto', example: 'Wash your face.', tip: 'Como verbo significa encarar/enfrentar: "face the problem".' },
    { id: 3, base: 'eye', pt: 'olho', example: 'She has green eyes.', tip: 'Pronuncia-se igual à letra I ("ai").' },
    { id: 4, base: 'ear', pt: 'orelha, ouvido', example: 'My ear hurts.', tip: 'Serve para a parte de fora e para a audição.' },
    { id: 5, base: 'mouth', pt: 'boca', example: 'Open your mouth.', tip: 'O "th" é o som de língua entre os dentes.' },
    { id: 6, base: 'tooth', pt: 'dente', example: 'I broke a tooth.', tip: 'Plural irregular: teeth. Dentista = "dentist".' },
    { id: 7, base: 'hair', pt: 'cabelo', example: 'Her hair is long.', tip: 'Incontável: "her hair is", nunca "her hairs are".' },
    { id: 8, base: 'hand', pt: 'mão', example: 'Give me your hand.', tip: 'Braço é "arm"; dedo da mão é "finger".' },
    { id: 9, base: 'arm', pt: 'braço', example: 'I broke my arm.', tip: 'Como verbo significa armar. Exército = "army".' },
    { id: 10, base: 'leg', pt: 'perna', example: 'My legs are tired.', tip: 'Pé é "foot" (plural: feet); dedo do pé é "toe".' },
    { id: 11, base: 'foot', pt: 'pé', example: 'My foot hurts.', tip: 'Plural irregular: feet. A pé = "on foot".' },
    { id: 12, base: 'back', pt: 'costas', example: 'My back hurts.', tip: 'Também significa "de volta" e "atrás" — três usos comuns.' },
    { id: 13, base: 'stomach', pt: 'estômago, barriga', example: 'I have a stomach ache.', tip: 'Pronuncia-se "STÂ-mek" — o "ch" tem som de k.' },
    { id: 14, base: 'heart', pt: 'coração', example: 'My heart is beating fast.', tip: 'Cuidado com "hurt" (machucar), que soa parecido.' },
    { id: 15, base: 'sick', pt: 'doente', example: 'I am sick today.', tip: 'Usa BE: "I am sick". No britânico "be sick" também significa vomitar.' },
    { id: 16, base: 'pain', pt: 'dor', example: 'I feel pain in my knee.', tip: 'Doloroso = "painful". Não confunda com "pen" (caneta).' },
    { id: 17, base: 'hurt', pt: 'doer; machucar', example: 'My legs hurt.', tip: 'Passado e particípio também são "hurt" — não muda.' },
    { id: 18, base: 'fever', pt: 'febre', example: 'The baby has a fever.', tip: 'Aqui usa HAVE: "have a fever", diferente de hungry/thirsty.' },
    { id: 19, base: 'cough', pt: 'tosse; tossir', example: 'I have a bad cough.', tip: 'Pronuncia-se "kóf".' },
    { id: 20, base: 'cold', pt: 'resfriado; frio', example: 'I caught a cold.', tip: 'Pegar um resfriado = "catch a cold". Estar com frio = "be cold".' },
    { id: 21, base: 'medicine', pt: 'remédio', example: 'Take this medicine twice a day.', tip: 'Tomar remédio é "take", não "drink".' },
    { id: 22, base: 'doctor', pt: 'médico', example: 'You should see a doctor.', tip: 'Ir ao médico = "see a doctor" ou "go to the doctor".' },
    { id: 23, base: 'hospital', pt: 'hospital', example: 'She is in the hospital.', tip: 'No britânico, sem artigo: "in hospital".' },
    { id: 24, base: 'healthy', pt: 'saudável', example: 'He eats healthy food.', tip: 'Saúde (substantivo) é "health", sem o -y.' },
    { id: 25, base: 'appointment', pt: 'consulta, compromisso marcado', example: 'I have an appointment at four.', tip: 'Falso amigo: não é "apontamento". É o horário marcado.' },
  ],
};
