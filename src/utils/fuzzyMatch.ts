/**
 * Utilitários para comparação aproximada de strings (Fuzzy Matching)
 * Usa a distância de Levenshtein para calcular similaridade
 */

/**
 * Calcula a distância de Levenshtein entre duas strings
 * (número mínimo de edições para transformar uma string na outra)
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;

  // Criar matriz de distâncias
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  // Inicializar primeira coluna e linha
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  // Preencher a matriz
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i - 1][j],     // Remoção
          dp[i][j - 1],     // Inserção
          dp[i - 1][j - 1]  // Substituição
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Calcula a similaridade entre duas strings (0 a 1)
 * 1 = strings idênticas, 0 = completamente diferentes
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;

  const distance = levenshteinDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);

  return 1 - distance / maxLength;
}

/**
 * Resultado da comparação fuzzy
 */
export interface FuzzyMatchResult {
  isExactMatch: boolean;      // Resposta exatamente correta
  isAcceptable: boolean;      // Resposta aceitável (dentro do threshold)
  similarity: number;         // Porcentagem de similaridade (0-100)
  userAnswer: string;         // Resposta normalizada do usuário
  correctAnswer: string;      // Resposta correta normalizada
}

/**
 * Compara a resposta do usuário com a resposta correta usando fuzzy matching
 * @param userAnswer - Resposta do usuário
 * @param correctAnswer - Resposta correta
 * @param threshold - Porcentagem mínima de similaridade para aceitar (padrão: 85%)
 */
export function fuzzyCompare(
  userAnswer: string,
  correctAnswer: string,
  threshold: number = 85
): FuzzyMatchResult {
  const normalizedUser = userAnswer.toLowerCase().trim();
  const normalizedCorrect = correctAnswer.toLowerCase().trim();

  // Verificar correspondência exata
  const isExactMatch = normalizedUser === normalizedCorrect;

  // Calcular similaridade
  const similarity = calculateSimilarity(normalizedUser, normalizedCorrect) * 100;

  // Verificar se está dentro do threshold
  const isAcceptable = similarity >= threshold;

  return {
    isExactMatch,
    isAcceptable,
    similarity: Math.round(similarity),
    userAnswer: normalizedUser,
    correctAnswer: normalizedCorrect
  };
}

/**
 * Verifica se a resposta é aceitável (exata ou fuzzy match)
 * Versão simplificada para uso rápido
 */
export function isAnswerAcceptable(
  userAnswer: string,
  correctAnswer: string,
  threshold: number = 85
): boolean {
  const result = fuzzyCompare(userAnswer, correctAnswer, threshold);
  return result.isAcceptable;
}
