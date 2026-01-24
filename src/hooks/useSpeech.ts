import { useCallback, useEffect, useState } from 'react';

// Hook personalizado para Text-to-Speech usando Web Speech API
export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Verifica se a Web Speech API é suportada
    setIsSupported('speechSynthesis' in window);
  }, []);

  const speak = useCallback((text: string, lang: string = 'en-US') => {
    if (!isSupported) {
      console.warn('Web Speech API não é suportada neste navegador');
      return;
    }

    // Cancela qualquer fala em andamento
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9; // Velocidade um pouco mais lenta para melhor compreensão
    utterance.pitch = 1;
    utterance.volume = 1;

    // Tenta encontrar uma voz em inglês
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (voice) => voice.lang.startsWith('en') && voice.name.includes('English')
    ) || voices.find((voice) => voice.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return { speak, stop, isSpeaking, isSupported };
}
