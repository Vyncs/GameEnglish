import type { Topic } from './topic';
import { TOPIC_VERBS_1 } from './lesson02Verbs';
import { TOPIC_VERBS_2 } from './lesson03Verbs';

// Registro de todos os tópicos de vocabulário, do mais fácil para o mais difícil.
// Para adicionar um tópico novo (adjetivos, clima, comida…): crie o arquivo de
// dados exportando um Topic e inclua aqui na posição certa de dificuldade.
export const TOPICS: Topic[] = [TOPIC_VERBS_1, TOPIC_VERBS_2];

export const findTopic = (id: string | null | undefined): Topic | undefined =>
  TOPICS.find((t) => t.id === id);
