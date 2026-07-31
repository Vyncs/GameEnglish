import { useEffect } from 'react';
import { toast } from 'sonner';

/**
 * O app é uma SPA: com a aba aberta, você navega entre as telas sem nunca
 * recarregar o JS — e continua na versão que carregou, mesmo depois de um deploy.
 *
 * Este hook compara o bundle que está rodando com o que o index.html do servidor
 * aponta agora. Quando muda, avisa e oferece recarregar. Não recarrega sozinho
 * para não derrubar ninguém no meio de um exercício.
 */

const CHECK_INTERVAL_MS = 5 * 60 * 1000;
const BUNDLE_RE = /assets\/index-[A-Za-z0-9_-]+\.js/;

export function useAppVersionCheck() {
  useEffect(() => {
    if (import.meta.env.DEV) return;

    const running = new URL(import.meta.url).pathname.match(BUNDLE_RE)?.[0];
    if (!running) return;

    let notified = false;

    const check = async () => {
      if (notified || document.hidden) return;
      try {
        const res = await fetch(`/?_v=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) return;
        const deployed = (await res.text()).match(BUNDLE_RE)?.[0];
        if (!deployed || deployed === running) return;

        notified = true;
        toast.info('Nova versão disponível', {
          description: 'Recarregue para pegar as novidades.',
          duration: Infinity,
          action: { label: 'Atualizar', onClick: () => window.location.reload() },
          onDismiss: () => { notified = false; },
        });
      } catch {
        // sem rede ou servidor fora: tenta de novo no próximo ciclo
      }
    };

    const onVisible = () => {
      if (!document.hidden) check();
    };

    check();
    const timer = setInterval(check, CHECK_INTERVAL_MS);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);
}
