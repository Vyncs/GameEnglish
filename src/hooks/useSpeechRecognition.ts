import { useState, useEffect, useCallback, useRef } from 'react';

// Tipos para Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

/**
 * Hook para reconhecimento de voz usando Web Speech API
 */
export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Verificar suporte do navegador
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognitionAPI);
    
    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
      };
      
      recognition.onerror = (event: Event) => {
        const errorEvent = event as Event & { error?: string };
        setError(errorEvent.error || 'Speech recognition error');
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };
      
      recognitionRef.current = recognition;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setError(null);
      try {
        recognitionRef.current.start();
      } catch (err) {
        // Já está escutando
        console.error('Speech recognition already started');
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}

// ==========================================
// FUNÇÕES DE COMPARAÇÃO DE TEXTO
// ==========================================

/**
 * Normaliza texto para comparação
 * - lowercase
 * - remove pontuação
 * - normaliza contrações
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s']/g, '') // remove pontuação exceto apóstrofo
    .replace(/\s+/g, ' ')     // normaliza espaços
    .trim();
}

/**
 * Normaliza contrações comuns
 */
export function normalizeContractions(text: string): string {
  const contractions: Record<string, string> = {
    "i'm": "i am",
    "you're": "you are",
    "he's": "he is",
    "she's": "she is",
    "it's": "it is",
    "we're": "we are",
    "they're": "they are",
    "i've": "i have",
    "you've": "you have",
    "we've": "we have",
    "they've": "they have",
    "i'll": "i will",
    "you'll": "you will",
    "he'll": "he will",
    "she'll": "she will",
    "we'll": "we will",
    "they'll": "they will",
    "i'd": "i would",
    "you'd": "you would",
    "he'd": "he would",
    "she'd": "she would",
    "we'd": "we would",
    "they'd": "they would",
    "isn't": "is not",
    "aren't": "are not",
    "wasn't": "was not",
    "weren't": "were not",
    "haven't": "have not",
    "hasn't": "has not",
    "hadn't": "had not",
    "won't": "will not",
    "wouldn't": "would not",
    "don't": "do not",
    "doesn't": "does not",
    "didn't": "did not",
    "can't": "cannot",
    "couldn't": "could not",
    "shouldn't": "should not",
    "mightn't": "might not",
    "mustn't": "must not",
    "let's": "let us",
    "that's": "that is",
    "who's": "who is",
    "what's": "what is",
    "here's": "here is",
    "there's": "there is",
    "where's": "where is",
    "wanna": "want to",
    "gonna": "going to",
    "gotta": "got to",
    "kinda": "kind of",
    "sorta": "sort of",
    "outta": "out of",
    "lotsa": "lots of",
    "coulda": "could have",
    "woulda": "would have",
    "shoulda": "should have",
    "musta": "must have",
    "'cause": "because",
    "cuz": "because",
    "cos": "because",
  };
  
  let normalized = text.toLowerCase();
  for (const [contraction, expanded] of Object.entries(contractions)) {
    normalized = normalized.replace(new RegExp(contraction, 'gi'), expanded);
  }
  return normalized;
}

/**
 * Calcula distância de Levenshtein entre duas strings
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

/**
 * Calcula similaridade entre duas palavras (0-1)
 */
export function wordSimilarity(word1: string, word2: string): number {
  const w1 = word1.toLowerCase();
  const w2 = word2.toLowerCase();
  
  if (w1 === w2) return 1;
  
  const maxLen = Math.max(w1.length, w2.length);
  if (maxLen === 0) return 1;
  
  const distance = levenshteinDistance(w1, w2);
  return 1 - distance / maxLen;
}

/**
 * Compara texto falado com texto esperado
 * Retorna array de resultados por palavra
 */
export function compareTexts(
  expected: string,
  spoken: string
): { words: Array<{ word: string; status: 'correct' | 'approximate' | 'missing' }>; accuracy: number } {
  // Normaliza ambos os textos
  const normalizedExpected = normalizeText(normalizeContractions(expected));
  const normalizedSpoken = normalizeText(normalizeContractions(spoken));
  
  const expectedWords = normalizedExpected.split(' ').filter(w => w.length > 0);
  const spokenWords = normalizedSpoken.split(' ').filter(w => w.length > 0);
  
  const results: Array<{ word: string; status: 'correct' | 'approximate' | 'missing' }> = [];
  let correctCount = 0;
  
  for (const expectedWord of expectedWords) {
    // Procura correspondência exata ou aproximada
    let bestMatch = { index: -1, similarity: 0 };
    
    for (let i = 0; i < spokenWords.length; i++) {
      const similarity = wordSimilarity(expectedWord, spokenWords[i]);
      if (similarity > bestMatch.similarity) {
        bestMatch = { index: i, similarity };
      }
    }
    
    if (bestMatch.similarity >= 0.9) {
      // Match exato ou muito próximo
      results.push({ word: expectedWord, status: 'correct' });
      correctCount += 1;
      // Remove palavra usada
      if (bestMatch.index >= 0) {
        spokenWords.splice(bestMatch.index, 1);
      }
    } else if (bestMatch.similarity >= 0.6) {
      // Match aproximado
      results.push({ word: expectedWord, status: 'approximate' });
      correctCount += 0.5;
      if (bestMatch.index >= 0) {
        spokenWords.splice(bestMatch.index, 1);
      }
    } else {
      // Palavra não encontrada
      results.push({ word: expectedWord, status: 'missing' });
    }
  }
  
  const accuracy = expectedWords.length > 0 
    ? Math.round((correctCount / expectedWords.length) * 100) 
    : 100;
  
  return { words: results, accuracy };
}
