import { lazy, Suspense, useEffect, useState } from 'react';

/**
 * RiveTutor — wrapper público.
 *
 * Estratégia "premium quando disponível, orb quando não":
 *
 *   1. Antes de carregar o bundle do Rive, faz HEAD em `/tutor/coach.riv`.
 *      - 200/206 → asset existe, faz lazy load do RiveTutorImpl.
 *      - 404/etc → renderiza nada (caller mostra orb fallback).
 *   2. Se o bundle ou o asset falhar em runtime (onLoadError),
 *      `onFallback()` é chamado pra trocar pelo orb.
 *
 * Bundle: o pacote `@rive-app/react-canvas` (~150KB gzip) só baixa quando
 * `coach.riv` realmente existe. Mantém first-load leve quando o asset não
 * está presente (caso atual — Semana 3 sem artista ainda).
 */

const RiveTutorImpl = lazy(() => import('./RiveTutorImpl'));

interface RiveTutorProps {
  size: number;
  /** Chamado quando precisa de fallback (asset 404 ou erro no Rive). */
  onFallback: () => void;
}

type AssetStatus = 'checking' | 'available' | 'absent' | 'errored';

const ASSET_URL = '/tutor/coach.riv';

// Cache global da checagem entre mounts — evita HEAD repetido em cada montagem.
let cachedStatus: AssetStatus | null = null;
let inflightCheck: Promise<AssetStatus> | null = null;

function checkAsset(): Promise<AssetStatus> {
  if (cachedStatus && cachedStatus !== 'checking') {
    return Promise.resolve(cachedStatus);
  }
  if (inflightCheck) return inflightCheck;
  inflightCheck = fetch(ASSET_URL, { method: 'HEAD' })
    .then((res) => {
      const status: AssetStatus = res.ok ? 'available' : 'absent';
      cachedStatus = status;
      return status;
    })
    .catch(() => {
      cachedStatus = 'errored';
      return 'errored' as AssetStatus;
    })
    .finally(() => {
      inflightCheck = null;
    });
  return inflightCheck;
}

export function RiveTutor({ size, onFallback }: RiveTutorProps) {
  const [assetStatus, setAssetStatus] = useState<AssetStatus>(cachedStatus ?? 'checking');

  useEffect(() => {
    if (assetStatus !== 'checking') return;
    let cancelled = false;
    checkAsset().then((status) => {
      if (cancelled) return;
      setAssetStatus(status);
      if (status !== 'available') onFallback();
    });
    return () => {
      cancelled = true;
    };
  }, [assetStatus, onFallback]);

  if (assetStatus !== 'available') {
    // Caller renderiza o orb fallback.
    return null;
  }

  return (
    <Suspense fallback={null}>
      <RiveTutorImpl size={size} onLoadError={onFallback} />
    </Suspense>
  );
}
