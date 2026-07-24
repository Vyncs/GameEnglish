// Dicionário de i18n da CASCA do app (navegação, botões, títulos de seção,
// rótulos de estatística). NÃO cobre o CONTEÚDO de aprendizagem — verbos,
// significados, títulos de tópico/aula, cards e jogos ficam como estão, porque
// esse é justamente o material que o usuário está estudando.
//
// Cada chave tem as duas línguas. O valor pode ser:
//   - uma string com marcadores {x}, interpolados por translate(); ou
//   - uma função (vars) => string, para casos com plural ou lógica.

export type Lang = 'pt' | 'en';

type Vars = Record<string, string | number>;
type Side = string | ((v: Vars) => string);
interface Entry {
  pt: Side;
  en: Side;
}

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

export const translations = {
  // ---- Navegação principal ----
  'nav.home': { pt: 'Início', en: 'Home' },
  'nav.groups': { pt: 'Grupos', en: 'Groups' },
  'nav.readers': { pt: 'Leituras', en: 'Readers' },
  'nav.review': { pt: 'Revisar', en: 'Review' },
  'nav.bricks': { pt: 'Blocos', en: 'Bricks' },
  'nav.pairs': { pt: 'Pares', en: 'Pairs' },
  'nav.karaoke': { pt: 'Karaokê', en: 'Karaoke' },
  'nav.coach': { pt: 'Tutor', en: 'Coach' },
  'nav.materials': { pt: 'Materiais', en: 'Materials' },
  'nav.inDevelopment': { pt: 'Em desenvolvimento', en: 'In development' },

  // ---- Tooltips do header ----
  'header.tip.locked': { pt: 'Assine para desbloquear', en: 'Subscribe to unlock' },
  'header.tip.inDev': { pt: 'Em desenvolvimento', en: 'In development' },
  'header.tip.reviewBadge': { pt: 'Você tem cards para revisar!', en: 'You have cards to review!' },
  'header.sfx.on': { pt: 'Ativar sons', en: 'Turn sounds on' },
  'header.sfx.off': { pt: 'Desativar sons', en: 'Turn sounds off' },
  'header.theme.toLight': { pt: 'Mudar para tema claro', en: 'Switch to light theme' },
  'header.theme.toDark': { pt: 'Mudar para tema escuro', en: 'Switch to dark theme' },
  'header.lang.toEn': { pt: 'Mudar o app para inglês', en: 'Switch the app to English' },
  'header.lang.toPt': { pt: 'Mudar o app para português', en: 'Switch the app to Portuguese' },
  'header.goHome': { pt: 'Ir para o início', en: 'Go to home' },

  // ---- Menu Conta ----
  'account.title': { pt: 'Conta', en: 'Account' },
  'account.profile': { pt: 'Meu perfil', en: 'My profile' },
  'account.install': { pt: 'Instalar app', en: 'Install app' },
  'account.admin': { pt: 'Admin', en: 'Admin' },
  'account.teacher': { pt: 'Professor', en: 'Teacher' },

  // ---- Home: sessão de hoje ----
  'home.today.title': { pt: 'Sessão de hoje', en: "Today's session" },
  'home.today.subtitle': { pt: 'Revisar · uma regra · palavras novas', en: 'Review · one rule · new words' },
  'home.today.review': { pt: 'Revisar', en: 'Review' },
  'home.today.reviewWaiting': {
    pt: (v) => `${v.n} ${plural(Number(v.n), 'card esperando', 'cards esperando')} por você`,
    en: (v) => `${v.n} ${plural(Number(v.n), 'card', 'cards')} waiting for you`,
  },
  'home.today.reviewDone': { pt: 'Você está em dia — nada pendente', en: "You're all caught up — nothing pending" },
  'home.today.reviewNow': { pt: 'Revisar agora', en: 'Review now' },
  'home.today.reviewAnyway': { pt: 'Praticar mesmo assim', en: 'Practice anyway' },
  'home.today.rule': { pt: 'Praticar a regra', en: 'Practice the rule' },
  'home.today.ruleDone': { pt: (v) => `${v.title} · concluída`, en: (v) => `${v.title} · completed` },
  'home.today.ruleProgress': {
    pt: (v) => `${v.title} · ${v.a}/${v.b} respondidas`,
    en: (v) => `${v.title} · ${v.a}/${v.b} answered`,
  },
  'home.today.words': { pt: 'Aprender palavras', en: 'Learn words' },
  'home.today.wordsProgress': {
    pt: (v) => `${v.emoji} ${v.title} · ${v.a}/${v.b} etapas`,
    en: (v) => `${v.emoji} ${v.title} · ${v.a}/${v.b} stages`,
  },

  // ---- CTAs genéricos ----
  'cta.continue': { pt: 'Continuar', en: 'Continue' },
  'cta.start': { pt: 'Começar', en: 'Start' },
  'cta.reviewLesson': { pt: 'Rever a aula', en: 'Review the lesson' },

  // ---- Home: KPIs ----
  'home.kpi.total': { pt: 'Total de Cards', en: 'Total Cards' },
  'home.kpi.toReview': { pt: 'Para Revisar', en: 'To Review' },
  'home.kpi.avgLevel': { pt: 'Nível Médio', en: 'Average Level' },
  'home.kpi.mastered': { pt: 'Dominados', en: 'Mastered' },
  'home.kpi.library': { pt: 'biblioteca', en: 'library' },
  'home.kpi.createGroupHint': { pt: 'comece criando um grupo', en: 'start by creating a group' },
  'home.kpi.readyNow': { pt: 'pronto agora', en: 'ready now' },
  'home.kpi.allDone': { pt: 'tudo em dia', en: 'all done' },

  // ---- Home: prateleiras ----
  'home.rail.lessons': { pt: 'Aulas', en: 'Lessons' },
  'home.rail.lessonsDesc': { pt: 'As regras — aprenda uma vez, use sempre', en: 'The rules — learn once, use forever' },
  'home.rail.answered': { pt: (v) => `${v.a}/${v.b} respondidas`, en: (v) => `${v.a}/${v.b} answered` },
  'home.rail.correct': { pt: (v) => `${v.n} acertos`, en: (v) => `${v.n} correct` },
  'home.rail.stages': { pt: (v) => `${v.a}/${v.b} etapas`, en: (v) => `${v.a}/${v.b} stages` },
  'home.rail.words': { pt: (v) => `${v.sub} · ${v.n} palavras`, en: (v) => `${v.sub} · ${v.n} words` },
  'home.rail.seeResult': { pt: 'Ver resultado →', en: 'See result →' },
  'home.rail.continue': { pt: 'Continuar →', en: 'Continue →' },
  'home.rail.start': { pt: 'Começar →', en: 'Start →' },
  'home.rail.review': { pt: 'Revisar →', en: 'Review →' },
  'home.rail.done': { pt: 'Concluído', en: 'Completed' },
  'level.easy': { pt: 'Fácil', en: 'Easy' },
  'level.medium': { pt: 'Médio', en: 'Medium' },
  'level.hard': { pt: 'Difícil', en: 'Hard' },

  // ---- Categorias de tópicos (rótulos de seção) ----
  'home.cat.verbos.label': { pt: 'Verbos', en: 'Verbs' },
  'home.cat.verbos.desc': { pt: 'Os verbos mais usados, em blocos de 25', en: 'The most-used verbs, in blocks of 25' },
  'home.cat.adjetivos.label': { pt: 'Adjetivos', en: 'Adjectives' },
  'home.cat.adjetivos.desc': { pt: 'Como descrever coisas, pessoas e situações', en: 'How to describe things, people and situations' },
  'home.cat.tempos.label': { pt: 'Tempos verbais', en: 'Verb tenses' },
  'home.cat.tempos.desc': { pt: 'Passado, presente e futuro na prática', en: 'Past, present and future in practice' },
  'home.cat.outros.label': { pt: 'Outros temas', en: 'Other topics' },
  'home.cat.outros.desc': { pt: 'Clima, comida, casa e mais', en: 'Weather, food, home and more' },

  // ---- Grupos ----
  'groups.mine': { pt: 'Meus Grupos', en: 'My Groups' },
  'groups.collections': {
    pt: (v) => `${v.n} ${plural(Number(v.n), 'coleção', 'coleções')}`,
    en: (v) => `${v.n} ${plural(Number(v.n), 'collection', 'collections')}`,
  },
  'groups.cardsTotal': {
    pt: (v) => `${v.n} ${plural(Number(v.n), 'card', 'cards')} no total`,
    en: (v) => `${v.n} ${plural(Number(v.n), 'card', 'cards')} in total`,
  },
  'groups.new': { pt: 'Novo Grupo', en: 'New Group' },
  'groups.newShort': { pt: 'Novo grupo', en: 'New group' },
  'groups.namePlaceholder': { pt: 'Nome do grupo...', en: 'Group name...' },
  'groups.create': { pt: 'Criar', en: 'Create' },
  'groups.cancel': { pt: 'Cancelar', en: 'Cancel' },
  'groups.emptyTitle': { pt: 'Comece sua biblioteca', en: 'Start your library' },
  'groups.emptyText': {
    pt: 'Crie seu primeiro grupo para começar a adicionar flash cards e construir seu progresso.',
    en: 'Create your first group to start adding flash cards and building your progress.',
  },
  'groups.emptyNone': { pt: 'Nenhum grupo criado', en: 'No groups yet' },
  'groups.createFirst': { pt: 'Criar Primeiro Grupo', en: 'Create First Group' },
  'groups.toReview': { pt: (v) => `${v.n} para revisar`, en: (v) => `${v.n} to review` },
  'groups.upToDate': { pt: 'Em dia', en: 'Up to date' },
  'groups.cards': { pt: (v) => `${plural(Number(v.n), 'card', 'cards')}`, en: (v) => `${plural(Number(v.n), 'card', 'cards')}` },
  'groups.level': { pt: (v) => `Nível ${v.x} / 5`, en: (v) => `Level ${v.x} / 5` },
  'groups.open': { pt: 'Abrir', en: 'Open' },
  'groups.reviewN': {
    pt: (v) => `Revisar ${v.n} ${plural(Number(v.n), 'card', 'cards')}`,
    en: (v) => `Review ${v.n} ${plural(Number(v.n), 'card', 'cards')}`,
  },
  'groups.deleteConfirm': {
    pt: 'Excluir este grupo e todos os seus cards?',
    en: 'Delete this group and all its cards?',
  },
  'groups.rename': { pt: (v) => `Renomear ${v.name}`, en: (v) => `Rename ${v.name}` },
  'groups.delete': { pt: (v) => `Excluir ${v.name}`, en: (v) => `Delete ${v.name}` },
  'groups.count': {
    pt: (v) => `${v.n} ${plural(Number(v.n), 'grupo', 'grupos')}`,
    en: (v) => `${v.n} ${plural(Number(v.n), 'group', 'groups')}`,
  },

  // ---- Home: ações rápidas ----
  'home.backup.title': { pt: 'Backup & Restauração', en: 'Backup & Restore' },
  'home.backup.subtitle': { pt: 'Exporte ou importe seu progresso', en: 'Export or import your progress' },
  'home.backup.export': { pt: 'Exportar', en: 'Export' },
  'home.backup.import': { pt: 'Importar', en: 'Import' },
  'home.tip.title': { pt: 'Dica de Estudo', en: 'Study Tip' },
  'home.tip.body1': {
    pt: 'A revisão espaçada é mais eficiente que estudar muitas horas seguidas.',
    en: 'Spaced repetition is more effective than studying for many hours in a row.',
  },
  'home.tip.body2': { pt: 'Revise alguns minutos todo dia', en: 'Review a few minutes every day' },
  'home.tip.body3': {
    pt: '— é assim que vocabulário fica retido pra valer.',
    en: '— that is how vocabulary really sticks.',
  },
} satisfies Record<string, Entry>;

export type TransKey = keyof typeof translations;

/** Traduz uma chave para a língua dada, interpolando {x} ou aplicando a função. */
export function translate(lang: Lang, key: TransKey, vars: Vars = {}): string {
  const entry = translations[key] as Entry | undefined;
  if (!entry) return key;
  const val = entry[lang] ?? entry.pt;
  if (typeof val === 'function') return val(vars);
  return val.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}
