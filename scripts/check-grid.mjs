// Sanidade da Grade 4V5T2S e do seu banco de treinos.
//
//   npm run check:grid
//
// Lê os .ts direto (transpila em memória, sem build) e confere os contratos que
// o TypeScript não pega: buracos na matriz, wrongIndex apontando para a palavra
// errada, célula sem exercício, célula fora do cronograma.

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import ts from 'typescript';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function load(rel) {
  const src = readFileSync(resolve(ROOT, rel), 'utf8');
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  return import('data:text/javascript;base64,' + Buffer.from(js, 'utf8').toString('base64'));
}

const grid = await load('src/data/grid4v5t2s.ts');
const trainer = await load('src/data/gridTrainer.ts');

const fail = [];
const warn = [];

// Toda combinação linha × coluna tem célula?
const missing = [];
for (const r of grid.GRID_ROWS) {
  for (const c of grid.GRID_COLS) {
    if (!grid.cellAt(r.id, c.id)) missing.push(`${r.id} × ${c.id}`);
  }
}
if (missing.length) fail.push('Células faltando na grade: ' + missing.join(', '));

// Ids de célula únicos
const ids = grid.GRID_CELLS.map((c) => c.id);
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dupes.length) fail.push('Ids de célula duplicados: ' + [...new Set(dupes)].join(', '));

// Campos que o dossiê lê sem checar
for (const c of grid.GRID_CELLS) {
  for (const f of ['opener', 'title', 'rule']) {
    if (!c[f] || !String(c[f]).trim()) fail.push(`${c.id}: campo "${f}" vazio`);
  }
  for (const k of ['q', 'a', 'n']) {
    if (!c.structure?.[k]?.en || !c.structure?.[k]?.pt) fail.push(`${c.id}: structure.${k} incompleta`);
  }
  if (!c.whQuestions?.length) fail.push(`${c.id}: sem whQuestions (o dossiê quebra)`);
  if (!c.examples?.length) warn.push(`${c.id}: sem examples`);
  if (!c.errors?.length) warn.push(`${c.id}: sem errors`);
}

// O contrato dos exercícios "error": wrongWord é o token em wrongIndex
for (const q of trainer.GRID_TRAINER_QUESTIONS) {
  if (q.kind !== 'error') continue;
  const tok = q.wrong.split(' ')[q.wrongIndex];
  if (tok !== q.wrongWord) {
    fail.push(`${q.id}: wrongIndex ${q.wrongIndex} aponta para "${tok}", mas wrongWord é "${q.wrongWord}"`);
  }
}

// Exercícios "opener": a resposta está entre as opções, e há lacuna
for (const q of trainer.GRID_TRAINER_QUESTIONS) {
  if (q.kind !== 'opener') continue;
  if (!q.options.includes(q.answer)) fail.push(`${q.id}: answer "${q.answer}" não está em options`);
  if (new Set(q.options).size !== q.options.length) fail.push(`${q.id}: options com repetição`);
  if (!q.blanked.includes('___')) fail.push(`${q.id}: blanked sem a lacuna ___`);
}

// Ids de exercício únicos, apontando para célula que existe
const qids = trainer.GRID_TRAINER_QUESTIONS.map((q) => q.id);
const qdupes = qids.filter((id, i) => qids.indexOf(id) !== i);
if (qdupes.length) fail.push('Ids de exercício duplicados: ' + [...new Set(qdupes)].join(', '));
for (const q of trainer.GRID_TRAINER_QUESTIONS) {
  if (!grid.findCell(q.cellId)) fail.push(`${q.id}: cellId "${q.cellId}" não existe`);
}

// Toda célula é treinável
for (const c of grid.GRID_CELLS) {
  if (!trainer.questionsFor([c.id]).length) fail.push(`${c.id}: nenhuma questão no banco de treino`);
}

// O cronograma só cita células que existem — e não esquece nenhuma
for (const w of grid.GRID_WEEKS) {
  for (const id of w.cellIds) {
    if (!grid.findCell(id)) fail.push(`Semana ${w.n}: cellId "${id}" não existe`);
  }
}
const inWeeks = new Set(grid.GRID_WEEKS.flatMap((w) => w.cellIds));
for (const c of grid.GRID_CELLS) {
  if (!inWeeks.has(c.id)) warn.push(`${c.id}: fora do cronograma de semanas`);
}


// ---------------------------------------------------------------- prática falada
const speaking = await load(`src/data/speakingPrompts.ts`);

// Todo item aponta para uma célula que existe — senão a dica do erro some.
for (const p of speaking.SPEAKING_PROMPTS) {
  if (!grid.findCell(p.cellId)) fail.push(`${p.id}: cellId "${p.cellId}" não existe na Grade`);
  if (!p.question?.trim()) fail.push(`${p.id}: sem pergunta`);
  if (!p.cuePt?.trim()) fail.push(`${p.id}: sem o enunciado em português (cuePt)`);
  if (!p.answer?.trim()) fail.push(`${p.id}: sem resposta modelo`);
}
const spIds = speaking.SPEAKING_PROMPTS.map((p) => p.id);
const spDupes = spIds.filter((id, i) => spIds.indexOf(id) !== i);
if (spDupes.length) fail.push(`Ids de prática falada duplicados: ${[...new Set(spDupes)].join(", ")}`);

console.log(`Prática falada: ${speaking.SPEAKING_PROMPTS.length} perguntas em ${Object.keys(speaking.promptCountByCell()).length} células`);


// ---------------------------------------------------------------- tópicos de vocabulário
const { readdirSync } = await import("fs");

const topicSrc = readFileSync(resolve(ROOT, "src/data/topic.ts"), "utf8");
const knownCats = [...topicSrc.matchAll(/\{\s*id:\s*'([^']+)',\s*label:/g)].map((m) => m[1]);

const i18nSrc = readFileSync(resolve(ROOT, "src/i18n/translations.ts"), "utf8");
for (const cat of knownCats) {
  for (const suffix of ["label", "desc"]) {
    if (!i18nSrc.includes(`'home.cat.${cat}.${suffix}'`)) {
      fail.push(`categoria "${cat}": falta a chave home.cat.${cat}.${suffix} em translations.ts`);
    }
  }
}

const topicFiles = readdirSync(resolve(ROOT, "src/data")).filter((f) => /^(topic[A-Z]|lesson0\d)/.test(f) && f.endsWith(".ts"));
const seenTopicIds = new Set();
let topicCount = 0;
let itemCount = 0;

for (const f of topicFiles) {
  const src = readFileSync(resolve(ROOT, "src/data", f), "utf8");
  const idMatch = src.match(/^\s*id:\s*'([^']+)',\s*$/m);
  const catMatch = src.match(/^\s*category:\s*'([^']+)',\s*$/m);
  if (!catMatch) continue; // não é um Topic (ex.: helpers)
  topicCount++;

  if (!knownCats.includes(catMatch[1])) {
    fail.push(`${f}: categoria "${catMatch[1]}" não existe em TOPIC_CATEGORIES — o tópico não aparece na Home`);
  }
  if (idMatch) {
    if (seenTopicIds.has(idMatch[1])) fail.push(`${f}: id de tópico "${idMatch[1]}" duplicado — os dois dividiriam o mesmo progresso`);
    seenTopicIds.add(idMatch[1]);
  }

  // O subtítulo anuncia um número que precisa bater com a lista.
  const items = [...src.matchAll(/\{\s*id:\s*\d+,\s*base:/g)].length;
  itemCount += items;
  const sub = src.match(/subtitle:\s*'([^']*)'/);
  const said = sub && sub[1].match(/(\d+)\s*(palavras|express)/);
  if (said && Number(said[1]) !== items) {
    fail.push(`${f}: o subtítulo diz ${said[1]}, mas a lista tem ${items} itens`);
  }

  // Todo registro do tópico precisa dos quatro campos que a tela lê.
  if (!src.includes("registered-check")) {
    const missingTip = [...src.matchAll(/\{\s*id:\s*(\d+),\s*base:\s*'([^']*)'/g)]
      .filter((m) => !m[2].trim())
      .map((m) => m[1]);
    if (missingTip.length) fail.push(`${f}: itens sem termo em inglês: ${missingTip.join(", ")}`);
  }
}

// Todo tópico registrado existe como arquivo, e todo arquivo está registrado.
const topicsIndex = readFileSync(resolve(ROOT, "src/data/topics.ts"), "utf8");
for (const f of topicFiles) {
  const src = readFileSync(resolve(ROOT, "src/data", f), "utf8");
  const exp = src.match(/export const (TOPIC_[A-Z0-9_]+)\s*:\s*Topic/);
  if (!exp) continue;
  if (!topicsIndex.includes(exp[1])) {
    fail.push(`${f}: ${exp[1]} não está registrado em topics.ts — invisível no app`);
  }
}

console.log(`Vocabulário: ${topicCount} tópicos · ${itemCount} itens · ${knownCats.length} prateleiras`);


// ---------------------------------------------------------------- frases da trilha
const KINDS = ["adj","prep","subst","adv","verbo","pron","conj","expr"];
const sentenceFiles = readdirSync(resolve(ROOT, "src/data")).filter((f) => /^sentences[A-Z]/.test(f) && f.endsWith(".ts"));
let sentenceCount = 0;
for (const f of sentenceFiles) {
  const mod = await load(`src/data/${f}`);
  const map = Object.values(mod)[0];
  if (!map || typeof map !== "object") { fail.push(`${f}: nao exporta um mapa de frases`); continue; }
  for (const [id, sen] of Object.entries(map)) {
    sentenceCount++;
    if (!sen.en?.trim()) fail.push(`${f} #${id}: frase em inglês vazia`);
    if (!sen.pt?.trim()) fail.push(`${f} #${id}: tradução vazia`);
    for (const w of sen.newWords ?? []) {
      if (!KINDS.includes(w.kind)) fail.push(`${f} #${id}: classe "${w.kind}" invalida em "${w.word}"`);
      // A palavra marcada precisa aparecer na frase, senão o chip nao faz sentido.
      if (!sen.en.toLowerCase().includes(w.word.toLowerCase().split(" ")[0])) {
        fail.push(`${f} #${id}: "${w.word}" esta marcada mas nao aparece na frase`);
      }
    }
  }
}

// Todo tópico que declara a etapa de frases precisa ter frases de verdade.
for (const f of topicFiles) {
  const src = readFileSync(resolve(ROOT, "src/data", f), "utf8");
  if (!/stages:.*sentences/.test(src)) continue;
  if (!src.includes("withSentences(")) {
    fail.push(`${f}: declara a etapa "sentences" mas nao aplica withSentences — a etapa abriria vazia`);
  }
}

console.log(`Frases da trilha: ${sentenceCount} em ${sentenceFiles.length} bloco(s)`);

console.log(`Grade: ${grid.GRID_ROWS.length} linhas × ${grid.GRID_COLS.length} colunas`);
console.log(`Células: ${grid.GRID_CELLS.length} · etapas: ${grid.GRID_TOTAL_STAGES} · semanas: ${grid.GRID_WEEKS.length}`);
console.log(`Exercícios: ${trainer.GRID_TRAINER_QUESTIONS.length}`);

if (warn.length) console.log('\nAVISOS:\n  ' + warn.join('\n  '));
if (fail.length) {
  console.log('\nFALHAS:\n  ' + fail.join('\n  '));
  process.exit(1);
}
console.log('\nTudo certo.');
