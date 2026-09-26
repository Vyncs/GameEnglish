import { withSentences, type Topic } from './topic';
import { SENTENCES_WORK } from './sentencesWork';

// Tópico: 25 palavras de trabalho — o vocabulário de escritório, reunião e
// currículo. Sem passado/particípio → não usa a etapa "Formas".

export const TOPIC_WORK: Topic = {
  id: 'work-01-25',
  title: 'Trabalho e escritório',
  subtitle: 'job → deadline',
  emoji: '💼',
  category: 'cotidiano',
  level: 2,
  // Memória para fixar, frases para falar, e o quiz fecha conferindo.
  stages: ['memory', 'sentences', 'meaning'],
  items: withSentences([
    { id: 1, base: 'job', pt: 'emprego, vaga', example: 'She got a new job.', tip: 'Job é o emprego (contável); work é o trabalho em si (incontável).' },
    { id: 2, base: 'work', pt: 'trabalho; trabalhar', example: 'I have a lot of work today.', tip: 'Incontável: nunca "works" no sentido de trabalho. Dois empregos = "two jobs".' },
    { id: 3, base: 'boss', pt: 'chefe', example: 'My boss is on vacation.', tip: 'Mais formal: "manager" ou "supervisor".' },
    { id: 4, base: 'employee', pt: 'funcionário', example: 'The company has fifty employees.', tip: 'Quem contrata é o "employer" — repare no final -ee × -er.' },
    { id: 5, base: 'company', pt: 'empresa', example: 'He works for a big company.', tip: 'Trabalhar numa empresa usa "for" ou "at", não "in".' },
    { id: 6, base: 'office', pt: 'escritório', example: 'I am at the office.', tip: 'Não é "oficina" — oficina mecânica é "garage" ou "workshop".' },
    { id: 7, base: 'meeting', pt: 'reunião', example: 'The meeting starts at ten.', tip: 'Estar em reunião = "be in a meeting".' },
    { id: 8, base: 'team', pt: 'equipe, time', example: 'We work as a team.', tip: 'Serve para esporte e trabalho.' },
    { id: 9, base: 'salary', pt: 'salário', example: 'The salary is good.', tip: 'Pagamento por hora é "wage". Contracheque é "paycheck".' },
    { id: 10, base: 'hire', pt: 'contratar', example: 'They hired three people.', tip: 'O oposto é "fire" (demitir) — hire × fire, quase iguais.' },
    { id: 11, base: 'fire', pt: 'demitir; fogo', example: 'He was fired last month.', tip: 'Demitir-se por vontade própria é "quit" ou "resign".' },
    { id: 12, base: 'quit', pt: 'pedir demissão, largar', example: 'She quit her job.', tip: 'Passado e particípio também são "quit" — não muda.' },
    { id: 13, base: 'apply', pt: 'candidatar-se', example: 'I applied for the job.', tip: 'Sempre com "for": apply for a job. Aplicar (usar) é outra coisa.' },
    { id: 14, base: 'interview', pt: 'entrevista', example: 'I have an interview tomorrow.', tip: 'Fazer entrevista como candidato = "have an interview".' },
    { id: 15, base: 'resume', pt: 'currículo', example: 'Send me your resume.', tip: 'Como verbo (retomar) pronuncia-se diferente. No britânico o currículo é "CV".' },
    { id: 16, base: 'skill', pt: 'habilidade', example: 'He has good communication skills.', tip: 'Quase sempre no plural em contexto profissional.' },
    { id: 17, base: 'task', pt: 'tarefa', example: 'I finished all my tasks.', tip: 'Sinônimo comum no escritório: "assignment".' },
    { id: 18, base: 'project', pt: 'projeto', example: 'We started a new project.', tip: 'Pronuncia-se "PRÓ-djekt" como substantivo.' },
    { id: 19, base: 'report', pt: 'relatório; relatar', example: 'I sent the report yesterday.', tip: 'Substantivo e verbo. "Report to someone" = se reportar a alguém.' },
    { id: 20, base: 'client', pt: 'cliente', example: 'The client is waiting.', tip: 'Cliente de loja é "customer"; de serviço profissional é "client".' },
    { id: 21, base: 'busy', pt: 'ocupado', example: 'I am busy right now.', tip: 'Pronuncia-se "BÍ-zi", com som de i.' },
    { id: 22, base: 'raise', pt: 'aumento (de salário)', example: 'She asked for a raise.', tip: 'Como verbo é levantar algo. No britânico o aumento é "rise".' },
    { id: 23, base: 'overtime', pt: 'hora extra', example: 'I worked overtime last week.', tip: 'Usa-se sem artigo: "work overtime".' },
    { id: 24, base: 'schedule', pt: 'agenda, cronograma; agendar', example: 'My schedule is full.', tip: 'Pronúncia americana "SKÉ-djul"; britânica "SHÉ-djul".' },
    { id: 25, base: 'deadline', pt: 'prazo final', example: 'The deadline is Friday.', tip: 'Cumprir o prazo = "meet the deadline"; perder = "miss the deadline".' },
  ], SENTENCES_WORK),
};
