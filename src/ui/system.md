# UI primitives

Base components da direção **"Caderno do aluno"**.

Documentação completa: [`/.interface-design/system.md`](../../../.interface-design/system.md)

## Como usar

```tsx
import { Button, Card, FlashPaper, Badge, LeitnerBox } from '@/ui';

<Button variant="primary" size="lg">
  Começar revisão
</Button>

<Card tab={{ label: 'Bricks', color: 'highlighter' }} padding="loose">
  ...
</Card>

<FlashPaper pt="Eu preciso ir agora" en="I need to go now" level={3} />

<Badge tone="chalkboard" variant="soft">Dominado</Badge>

<LeitnerBox
  countByLevel={{ 1: 12, 2: 8, 3: 15, 4: 4, 5: 1 }}
  dueLevel={2}
  onSelectLevel={(level) => navigate(`/play?level=${level}`)}
/>
```

## Princípios em uma frase

- **Cor com significado**, não decoração: cada cor da paleta vem de um objeto físico do estudo (Bic, vermelho do prof, highlighter, lousa, manila).
- **Profundidade por papel**: borders + sombras curtas, **sem glow**.
- **Duas vozes tipográficas**: Inter pra UI, Caveat pra texto inglês dos cards.
- **Cantos vivos**: papel não é redondo. `rounded-md` (8px) em botões.
- **Micro animações**, sem bounce.

## Arquivos

- `tokens.ts` — fonte da verdade
- `Button.tsx` · `Card.tsx` · `Badge.tsx` · `LeitnerBox.tsx` — primitivos
- `index.ts` — re-exports
