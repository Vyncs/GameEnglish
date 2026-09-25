# Play Flash Cards — modelo de navegação atual

Brief para redesenho da navegação e da Home.
Levantado do código em 2026-09-10. Todos os números vêm do fonte, não de estimativa.

---

## 1. O que é o app

Aplicativo de estudo de inglês para falantes de português, construído em torno de um
método próprio chamado **4V5T2S**: uma matriz de 4 tipos de verbo × 5 tempos onde o
aluno escolhe a linha e a coluna e a estrutura da frase "sai pronta".

Além da matriz, o app tem vocabulário em blocos, flashcards com revisão espaçada,
quatro jogos, leitura graduada e um tutor por IA.

Stack: Vite + React 19 + TypeScript + Tailwind v4. Front na Netlify, API no Render,
banco no Supabase.

### Para quem é

Os três ao mesmo tempo, e essa é a tensão central do redesenho:

1. **O autor**, que usa como o próprio caderno de estudo e conhece o método de cor.
2. **Alunos dele**, que precisam ser guiados e não conhecem a nomenclatura 4V5T2S.
3. **Assinantes futuros** — o backend já tem Stripe e MercadoPago —, que precisam
   entender o app sozinhos no primeiro minuto.

Hoje a interface atende bem só o primeiro.

---

## 2. As 19 telas

O app tem um único estado `viewMode` que decide o que renderiza. São 19 valores:

### Conteúdo de gramática (o método)

| Tela | O que é | Volume |
|---|---|---|
| `grid-4v5t2s` | A matriz 4×5. Cada célula abre um dossiê com regra, pergunta/afirmativa/negativa, marcadores, erros clássicos e perguntas wh-. Tem treino próprio e um trilho de 13 semanas. | 24 células, 13 semanas, 118 exercícios |
| `lesson-classify` | Aula 01 — classificar verbos em A/B/B2/C | 1 aula |
| `lesson-did-have` | Aula sobre did × have | 1 aula |
| `past-trainer` | Irregulares agrupados por família de som | famílias de verbos |

### Conteúdo de vocabulário

| Tela | O que é | Volume |
|---|---|---|
| `topic` | Estudo de um bloco de vocabulário, em 2–3 etapas: Estudar → Significado → Formas | 11 tópicos, 266 itens |

Os 11 tópicos são organizados em 4 categorias: Verbos (4 blocos de 25), Adjetivos (2),
Tempos verbais (2), Outros temas (3).

### Flashcards e revisão

| Tela | O que é |
|---|---|
| `cards` | Lista de cartões dos grupos do usuário |
| `review` | Sessão de revisão espaçada |
| `review-hub` | Central de revisão |
| `play` | Modo jogo sobre os cartões (PT→EN, EN→PT ou misto) |

### Jogos

| Tela | O que é |
|---|---|
| `bricks` / `bricks-challenge` | Escolhe um verbo e pratica 10 estruturas gramaticais com ele |
| `memory` | Jogo da memória de pares (Pairs) |
| `karaoke` | Cantar acompanhando a letra |

### Outros

| Tela | O que é |
|---|---|
| `readers` | Leitura graduada, com gerador de histórias por IA |
| `english-coach` | Tutor conversacional por IA, com voz e avatar |
| `teacher-materials` | Materiais atribuídos pelo professor |
| `account` | Conta e assinatura |
| `install` | Instruções de instalação (PWA) |
| `home` | A Home |

---

## 3. O problema central: duas navegações e cinco órfãs

**Existem dois menus diferentes, e eles não têm os mesmos itens.**

| | Desktop (header) | Mobile (bottom bar) |
|---|---|---|
| Itens | 9 | 5 |
| Quais | Início · Grupos · Readers · Revisar · Bricks · Pairs · Karaoke · English Coach · Materiais | Início · Bricks · Revisar · Pairs · Readers |

No celular somem quatro coisas que existem no desktop: **Grupos, Karaoke, English Coach
e Materiais**. O tutor por IA — provavelmente a feature mais cara de construir do app —
simplesmente não tem entrada no celular.

E há **cinco telas de conteúdo que não estão em nenhum dos dois menus**:

- `grid-4v5t2s` — a matriz, que é o método que dá nome ao produto
- `lesson-classify` — Aula 01
- `lesson-did-have` — Aula did × have
- `past-trainer` — treino de irregulares
- `topic` — todo o vocabulário, os 266 itens

Todas só são alcançáveis rolando a Home até encontrar a prateleira certa. Contando os
pontos de entrada no código: a Grade tem **1**; o Karaoke tem **1**. Se o aluno fechar
o app na tela errada, não há caminho de volta pelo menu.

**O efeito prático:** o conteúdo mais denso e mais próprio do produto é o mais escondido,
e os jogos — que são acessórios — ocupam 3 das 5 abas do celular (Bricks, Pairs, e
Revisar).

---

## 4. A Home hoje

Tela única, rolagem vertical longa, seis blocos nesta ordem:

1. **HOJE** — a sessão do dia, três cartões: Revisar / Regra do dia / Palavras do dia
2. **KPIs** — números de progresso
3. **AULAS** — prateleira horizontal: Aula 01, Aula did×have, Grade 4V5T2S
4. **TÓPICOS** — quatro prateleiras horizontais, uma por categoria (o treino de passado
   fica dentro da prateleira "Verbos")
5. **MEUS GRUPOS** — os grupos de flashcards do usuário, com barra de domínio
6. **AÇÕES RÁPIDAS** — backup/restauração e dica do dia

A Home acumula três papéis que brigam entre si: painel do dia (bloco 1), catálogo de
conteúdo (blocos 3 e 4) e ferramenta de gerenciamento (blocos 5 e 6). Como é a única
porta para cinco telas, ela não pode encurtar sem quebrar o acesso.

---

## 5. Três vocabulários de progresso que não conversam

O app mede avanço de três formas incompatíveis, e o aluno vê as três misturadas:

| Sistema | Unidade de avanço |
|---|---|
| Tópicos | etapas nomeadas: `study` → `meaning` → `forms` |
| Grade 4V5T2S | 24 células "dominadas" + um trilho de 13 semanas |
| Jogos | recordes soltos (melhor tempo, melhor pontuação, menos jogadas) |

Guardados em quatro chaves separadas de `localStorage`:
`english-verb-lessons-progress`, `english-lessons-progress`, `english-grid-routine` e
`english-flashcards-storage`.

Bricks, Pairs e Karaoke **não registram progresso nenhum** — apesar de dois deles terem
aba própria no celular.

Não existe, em lugar nenhum do sistema, a ideia de "fase". Não há um caminho: há uma
vitrine, e cada módulo tem sua noção particular de avanço.

---

## 6. O que já existe e ainda não tem interface

O backend tem um motor de retenção pronto que **nunca chegou a rodar** (o deploy que o
trazia falha desde abril): serviços de **XP**, **missões** e **streak**, com rotas de
progresso e de atividade.

Isso é matéria-prima disponível para o redesenho. Se a navegação nova precisar de um
fio condutor — "o que eu faço agora", "quanto falta", "o que ganhei" —, o backend já
sabe responder; falta a superfície.

---

## 7. Restrições que o desenho precisa respeitar

1. **O progresso vive no navegador de cada aluno**, não no servidor. Não é sincronizado
   entre dispositivos, e limpar os dados do site zera tudo.
2. **Os identificadores de tela e de etapa são chaves persistidas.** Renomear um id
   apaga o progresso de quem já o concluiu. Nomes internos podem parecer arbitrários
   (`D1`, `B2-perfect`) — o rótulo visível pode mudar; o id, não.
3. **A troca de idioma cobre só a casca** (navegação, botões, títulos). O conteúdo de
   estudo — verbos, significados, frases de exemplo — fica em inglês/português como
   está, porque é o material sendo aprendido.
4. **É um PWA** usado no celular. O desenho mobile é o principal, não a adaptação.
5. A nomenclatura do método (linhas A/B/B2/C, colunas, células) é familiar ao autor e
   opaca para todo mundo. O redesenho pode traduzir esses rótulos, mas o modelo por
   trás — linha × coluna — é o valor do produto e deve continuar legível.

---

## 8. Perguntas em aberto

1. Qual é a **porta de entrada** para um aluno novo? Hoje ele cai numa Home com seis
   blocos e nenhuma indicação de por onde começar.
2. Os quatro jogos merecem o mesmo peso do conteúdo do método? Hoje ocupam mais espaço
   na navegação do que a matriz que dá nome ao app.
3. Deve haver **um** caminho principal com o resto como exploração livre, ou o app
   continua sendo um catálogo onde o aluno escolhe?
4. Como reconciliar as três noções de progresso numa só barra que o aluno entenda?
5. O que acontece com as duas navegações — mobile e desktop convergem para o mesmo
   conjunto, ou continuam diferentes de propósito?
6. Onde entram XP, missões e streak sem transformar um app de estudo num jogo de pontos?
