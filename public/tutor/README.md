# Coach Avatar — Contrato Rive

Este diretório (servido em `/tutor/...` pela Vite) deve conter o arquivo
`coach.riv` que dá vida ao avatar do English Coach.

**Status atual:** sem asset → o app cai no orb premium (fallback automático).
Quando o `.riv` for adicionado, o lip sync ativa imediatamente. Sem mudança
de código.

## Como o asset é detectado

1. O `RiveTutor` faz `HEAD /tutor/coach.riv` no boot.
   - 200 → carrega o pacote `@rive-app/react-canvas` lazy e renderiza.
   - 404 → cai no orb (sem custo de bundle).
2. Se o arquivo existir mas falhar em carregar (asset corrompido, state
   machine errada), `onLoadError` é disparado e idem cai pro orb.

## Contrato esperado

### Artboard
- Nome: `Coach`
- Tamanho recomendado: 800×800 px (ou 1:1 qualquer; Vite serve do `public/`).

### State Machine
- Nome: **`Avatar SM`** (exato — usado no código).

### Inputs (todos `Number`, exceto onde indicado)

| Nome | Range | Significado |
|---|---|---|
| `state` | `0..5` | `0=idle 1=listening 2=thinking 3=speaking 4=correcting 5=celebrating` |
| `viseme` | `0..8` | `0=silent 1=AA 2=EH 3=IY 4=OH 5=OW 6=L 7=M 8=F` |
| `mouthWeight` | `0..1` | Intensidade da abertura da boca (suavização). Use pra blend. |

### Triggers opcionais (qualidade)

| Nome | Quando dispara |
|---|---|
| `onCorrect` | Aluno acertou algo que costumava errar (futuro hook) |
| `onMistake` | Mensagem com correção significativa (futuro hook) |

> Triggers não são obrigatórios para o lip sync básico funcionar — mas
> melhoram a percepção emocional. Hoje ainda não disparados por código,
> previstos pra Semana 4 (gamificação).

## Visemas — referência visual

| ID | Shape | Caracteres típicos | Forma da boca |
|---|---|---|---|
| 0 | `silent` | espaço, pontuação | fechada/neutra |
| 1 | `AA` | a, ah | aberta vertical |
| 2 | `EH` | e, é | aberta média |
| 3 | `IY` | i, y | esticada horizontal |
| 4 | `OH` | o, ó | redonda média |
| 5 | `OW` | u, ú | redonda fechada |
| 6 | `L` | l, n, t, d, s | semi-aberta neutra |
| 7 | `M` | m, b, p | lábios fechados (bilabial) |
| 8 | `F` | f, v | lábio inferior + dente superior |

## Como o lip sync funciona em runtime

```
ElevenLabs API
  → audio MP3 + alignment de caracteres com timestamps
  → backend (visemeMapper.js) → Viseme[] = [{time, shape, weight}, ...]
  → frontend useCurrentViseme (rAF a cada frame)
  → lê audio.currentTime, encontra viseme ativo
  → escreve em rive input "viseme" + "mouthWeight"
  → Rive State Machine renderiza a boca
```

A sincronização é **frame-perfect** porque ancora em `audio.currentTime` real,
não em timers JS. Funciona em qualquer playbackRate.

## Estados e transições visuais sugeridas

- **idle**: respiração 4s, blink 3-6s aleatório, micro-movimentos de cabeça.
- **listening**: leans forward 3°, eye contact direto, ear "antena" pulsa.
- **thinking**: olhar pra cima/lado, mão no queixo, partícula "..." flutuando.
- **speaking**: lip sync via `viseme` + `mouthWeight`, blink pausado, head bob sutil.
- **correcting**: aponta com gesto suave, sobrancelha "explicativa", pose didática.
- **celebrating**: pula, confetti, expressão alegre.

## Como produzir

1. **Rive Studio** (https://rive.app) — editor visual.
2. Crie o personagem como vetor.
3. Adicione blendshapes ou layers para cada viseme (8 + silent).
4. Crie a State Machine `Avatar SM` com os inputs acima.
5. Configure transições entre estados via input `state`.
6. Configure blend dos visemas via inputs `viseme` + `mouthWeight`.
7. Exporte como `.riv` e coloque aqui em `public/tutor/coach.riv`.

## Tamanho recomendado

Asset final: **< 200 KB**. Rives bem produzidos costumam dar 50-150 KB.
Acima disso, considere reduzir vetores ou simplificar bones.

## Fallback automático

Se nada funcionar, o orb premium (Semana 2) continua sendo a UX padrão. O
sistema NUNCA fica sem avatar visível.
