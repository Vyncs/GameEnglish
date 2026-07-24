import type { Topic } from './topic';
import { TOPIC_VERBS_1 } from './lesson02Verbs';
import { TOPIC_VERBS_2 } from './lesson03Verbs';
import { TOPIC_VERBS_3 } from './lesson04Verbs';
import { TOPIC_VERBS_4 } from './lesson05Verbs';
import { TOPIC_ADJECTIVES } from './topicAdjectives';
import { TOPIC_WEATHER } from './topicWeather';

// Registro de todos os tópicos de vocabulário, do mais fácil para o mais difícil.
// A ordem deste array é a ordem exibida na Home.
// Para adicionar um tópico novo (clima, comida…): crie o arquivo de dados
// exportando um Topic e inclua aqui na posição certa de dificuldade.
export const TOPICS: Topic[] = [
  TOPIC_VERBS_1,
  TOPIC_ADJECTIVES,
  TOPIC_WEATHER,
  TOPIC_VERBS_2,
  TOPIC_VERBS_3,
  TOPIC_VERBS_4,
];

export const findTopic = (id: string | null | undefined): Topic | undefined =>
  TOPICS.find((t) => t.id === id);
