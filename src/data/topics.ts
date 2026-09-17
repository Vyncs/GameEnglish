import type { Topic } from './topic';
import { TOPIC_VERBS_1 } from './lesson02Verbs';
import { TOPIC_VERBS_2 } from './lesson03Verbs';
import { TOPIC_VERBS_3 } from './lesson04Verbs';
import { TOPIC_VERBS_4 } from './lesson05Verbs';
import { TOPIC_ADJECTIVES } from './topicAdjectives';
import { TOPIC_ADJECTIVES_2 } from './topicAdjectives2';
import { TOPIC_WEATHER } from './topicWeather';
import { TOPIC_TIME_MARKERS } from './topicTimeMarkers';
import { TOPIC_FREQUENCY } from './topicFrequency';
import { TOPIC_PHRASAL } from './topicPhrasal';
import { TOPIC_PRONOUNS } from './topicPronouns';
import { TOPIC_FOOD } from './topicFood';
import { TOPIC_HOME } from './topicHome';
import { TOPIC_WORK } from './topicWork';
import { TOPIC_TRAVEL } from './topicTravel';
import { TOPIC_HEALTH } from './topicHealth';
import { TOPIC_SHOPPING } from './topicShopping';
import { TOPIC_CONNECTORS } from './topicConnectors';

// Registro de todos os tópicos de vocabulário, do mais fácil para o mais difícil.
// A ordem deste array é a ordem exibida na Home.
// Para adicionar um tópico novo (clima, comida…): crie o arquivo de dados
// exportando um Topic e inclua aqui na posição certa de dificuldade.
export const TOPICS: Topic[] = [
  TOPIC_VERBS_1,
  TOPIC_ADJECTIVES,
  TOPIC_TIME_MARKERS,
  TOPIC_FREQUENCY,
  TOPIC_PRONOUNS,
  TOPIC_WEATHER,
  TOPIC_FOOD,
  TOPIC_HOME,
  TOPIC_VERBS_2,
  TOPIC_ADJECTIVES_2,
  TOPIC_WORK,
  TOPIC_TRAVEL,
  TOPIC_HEALTH,
  TOPIC_SHOPPING,
  TOPIC_PHRASAL,
  TOPIC_CONNECTORS,
  TOPIC_VERBS_3,
  TOPIC_VERBS_4,
];

export const findTopic = (id: string | null | undefined): Topic | undefined =>
  TOPICS.find((t) => t.id === id);
