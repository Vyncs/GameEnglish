// RiveTutorImpl — implementação real (lazy-loaded). Se este arquivo é
// carregado, o usuário tem rede + bundle do Rive baixado.
//
// CONTRATO ESPERADO DO ARQUIVO `coach.riv` (ver `/public/tutor/README.md`):
//
//   Artboard padrão: "Coach"
//   State Machine padrão: "Avatar SM"
//
//   Inputs (todos NUMBER, exceto onde indicado):
//     - state           number 0..5     // 0=idle 1=listening 2=thinking 3=speaking 4=correcting 5=celebrating
//     - viseme          number 0..8     // 0=silent 1=AA 2=EH 3=IY 4=OH 5=OW 6=L 7=M 8=F
//     - mouthWeight     number 0..1     // intensidade da abertura
//
//   Triggers opcionais (qualidade):
//     - onCorrect       trigger         // celebra acerto
//     - onMistake       trigger         // expressão de "ah, deixa eu te ajudar"
//
// Caminho do .riv: `/tutor/coach.riv` (servido por Vite estático).

import { useEffect, useMemo } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import type { AvatarStateKind, Viseme, VisemeShape } from '../../../types/englishCoach';
import { useAvatarStateOptional } from './AvatarStateProvider';
import { useCurrentViseme } from '../../../hooks/useCurrentViseme';

const RIV_URL = '/tutor/coach.riv';
const STATE_MACHINE = 'Avatar SM';

const STATE_INDEX: Record<AvatarStateKind, number> = {
  idle: 0,
  listening: 1,
  thinking: 2,
  speaking: 3,
  correcting: 4,
  celebrating: 5,
};

const VISEME_INDEX: Record<VisemeShape, number> = {
  silent: 0,
  AA: 1,
  EH: 2,
  IY: 3,
  OH: 4,
  OW: 5,
  L: 6,
  M: 7,
  F: 8,
};

export interface RiveTutorImplProps {
  size: number;
  /** Chamado quando o arquivo .riv falha em carregar — permite fallback graceful. */
  onLoadError?: () => void;
}

export default function RiveTutorImpl({ size, onLoadError }: RiveTutorImplProps) {
  const ctx = useAvatarStateOptional();

  const { rive, RiveComponent } = useRive({
    src: RIV_URL,
    stateMachines: STATE_MACHINE,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    autoplay: true,
    onLoadError: () => {
      console.warn('[RiveTutor] Failed to load coach.riv — fallback to orb.');
      onLoadError?.();
    },
  });

  // Inputs da state machine (null até o arquivo carregar/expor o input).
  const stateInput = useStateMachineInput(rive, STATE_MACHINE, 'state');
  const visemeInput = useStateMachineInput(rive, STATE_MACHINE, 'viseme');
  const mouthWeightInput = useStateMachineInput(rive, STATE_MACHINE, 'mouthWeight');

  // Estado do avatar. Default 'idle' se não houver provider (defensivo).
  const stateKind: AvatarStateKind = ctx?.state.kind ?? 'idle';

  // Audio + visemes — só quando estado é 'speaking'.
  const speakingAudio =
    ctx?.state.kind === 'speaking' ? ctx.state.audioElement ?? null : null;
  const speakingVisemes: Viseme[] | null =
    ctx?.state.kind === 'speaking' ? ctx.state.visemes ?? null : null;

  const currentViseme = useCurrentViseme({
    audio: speakingAudio,
    visemes: speakingVisemes,
  });

  // Sincroniza state com input do Rive.
  useEffect(() => {
    if (!stateInput) return;
    stateInput.value = STATE_INDEX[stateKind];
  }, [stateKind, stateInput]);

  // Sincroniza viseme + weight com input do Rive (em cada frame via React).
  useEffect(() => {
    if (visemeInput) {
      visemeInput.value = VISEME_INDEX[currentViseme.shape];
    }
    if (mouthWeightInput) {
      mouthWeightInput.value = currentViseme.weight;
    }
  }, [currentViseme.shape, currentViseme.weight, visemeInput, mouthWeightInput]);

  const dim = useMemo(() => ({ width: size, height: size }), [size]);

  return (
    <div
      className="relative shrink-0"
      style={dim}
      data-avatar-state={stateKind}
      data-avatar-viseme={currentViseme.shape}
      aria-label={`Tutor avatar — ${stateKind}`}
    >
      <RiveComponent style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
