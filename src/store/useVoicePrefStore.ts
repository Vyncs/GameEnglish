import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Preferência de voz das etapas faladas.
//
// O padrão é ligado: na etapa "Frases" o áudio toca sozinho quando o card
// abre e o aluno repete falando. Quem está sem fone ou em lugar público
// desliga UMA vez aqui no perfil — não card a card, para a exigência não
// virar um botão fácil de ignorar no meio do exercício.
//
// Desligado, a etapa continua funcionando: mostra a frase, não toca áudio e
// não pede microfone.

interface VoicePrefState {
  /** Áudio automático + repetição falada nas etapas de frase. */
  voiceEnabled: boolean;
  setVoiceEnabled: (on: boolean) => void;
  toggleVoice: () => void;
}

export const useVoicePrefStore = create<VoicePrefState>()(
  persist(
    (set, get) => ({
      voiceEnabled: true,
      setVoiceEnabled: (on) => set({ voiceEnabled: on }),
      toggleVoice: () => set({ voiceEnabled: !get().voiceEnabled }),
    }),
    { name: 'english-app-voice' },
  ),
);
