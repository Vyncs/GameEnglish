// Tela inicial — só a trilha.
//
// Antes aqui moravam seis blocos: a sessão do dia, quatro KPIs, prateleiras de
// aulas e de tópicos, a lista de grupos e as ações rápidas. Virou uma rolagem
// longa que respondia "o que existe no app" quando a pergunta do aluno é
// "o que eu faço agora".
//
// Para onde foi cada coisa:
//   números (total, a revisar, nível, dominados) .. Conta
//   backup e restauração ......................... Conta
//   grupos de cards .............................. aba Grupos, que já existia
//   aulas, tópicos e a sessão do dia ............. círculos da trilha
//
// A trilha em si vive em HomePath.

import { HomePath } from './HomePath';

export function Home() {
  return <HomePath />;
}
