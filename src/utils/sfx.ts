// Efeitos sonoros de acerto/erro, sintetizados na hora com a Web Audio API.
//
// Por que não usar arquivos de áudio: um par de MP3s custaria ~30-60 KB, mais
// uma requisição, mais o risco de atrasar no primeiro acerto. Sintetizado é
// instantâneo, pesa zero e nunca "chega atrasado".

let ctx: AudioContext | null = null;
let enabled = true;

/** Liga/desliga globalmente (chamado pelo store de preferências). */
export function setSfxEnabled(value: boolean) {
  enabled = value;
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    // Navegadores suspendem o contexto até haver interação do usuário.
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** Toca uma nota curta com ataque/decaimento suaves (sem estalo). */
function tone(
  audio: AudioContext,
  freq: number,
  startAt: number,
  duration: number,
  type: OscillatorType,
  peak: number,
) {
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startAt);

  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(peak, startAt + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  osc.connect(gain).connect(audio.destination);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.02);
}

/** Acerto: duas notas ascendentes (terça maior), timbre limpo. */
export function playCorrect() {
  if (!enabled) return;
  const audio = getCtx();
  if (!audio) return;
  const t = audio.currentTime;
  tone(audio, 660, t, 0.12, 'sine', 0.16); // E5
  tone(audio, 880, t + 0.09, 0.18, 'sine', 0.14); // A5
}

/** Erro: duas notas descendentes e mais graves — negativo, mas sem agredir. */
export function playWrong() {
  if (!enabled) return;
  const audio = getCtx();
  if (!audio) return;
  const t = audio.currentTime;
  tone(audio, 300, t, 0.14, 'triangle', 0.14);
  tone(audio, 200, t + 0.1, 0.2, 'triangle', 0.12);
}

/** Conclusão de etapa/partida: arpejo curto de vitória. */
export function playFinish() {
  if (!enabled) return;
  const audio = getCtx();
  if (!audio) return;
  const t = audio.currentTime;
  [523, 659, 784, 1047].forEach((f, i) => tone(audio, f, t + i * 0.085, 0.22, 'sine', 0.13));
}
