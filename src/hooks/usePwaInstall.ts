import { useCallback, useEffect, useState } from 'react';

// Evento beforeinstallprompt (não tipado por padrão no lib.dom)
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export type PwaPlatform = 'android' | 'ios' | 'desktop' | 'other';

interface PwaInstallState {
  /** true quando o app já está rodando instalado (standalone) */
  isInstalled: boolean;
  /** true quando o navegador disponibilizou o prompt nativo (Android/Chrome/Edge) */
  canPrompt: boolean;
  /** plataforma detectada, para escolher as instruções corretas */
  platform: PwaPlatform;
  /** true no Safari do iOS, onde a instalação é manual (Compartilhar → Adicionar à Tela de Início) */
  isIosSafari: boolean;
  /** dispara o prompt nativo; resolve em 'accepted' | 'dismissed' | 'unavailable' */
  promptInstall: () => Promise<'accepted' | 'dismissed' | 'unavailable'>;
}

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const mm = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  // iOS expõe navigator.standalone
  const iosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  return Boolean(mm || iosStandalone);
}

function detectPlatform(): { platform: PwaPlatform; isIosSafari: boolean } {
  if (typeof navigator === 'undefined') return { platform: 'other', isIosSafari: false };
  const ua = navigator.userAgent || '';
  const isIpadOs = navigator.platform === 'MacIntel' && (navigator as unknown as { maxTouchPoints?: number }).maxTouchPoints ? (navigator as unknown as { maxTouchPoints: number }).maxTouchPoints > 1 : false;
  const isIos = /iPad|iPhone|iPod/.test(ua) || isIpadOs;
  const isAndroid = /Android/.test(ua);
  // Safari (não Chrome/Firefox/Edge no iOS, que usam WebKit mas com UA distinta)
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
  const isIosSafari = isIos && isSafari;

  let platform: PwaPlatform = 'other';
  if (isAndroid) platform = 'android';
  else if (isIos) platform = 'ios';
  else if (/Windows|Macintosh|Linux/.test(ua)) platform = 'desktop';

  return { platform, isIosSafari };
}

export function usePwaInstall(): PwaInstallState {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(detectStandalone);
  const [{ platform, isIosSafari }] = useState(detectPlatform);

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setIsInstalled(true);
      setDeferred(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    const mq = window.matchMedia('(display-mode: standalone)');
    const onDisplayChange = () => setIsInstalled(detectStandalone());
    mq.addEventListener?.('change', onDisplayChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
      mq.removeEventListener?.('change', onDisplayChange);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferred) return 'unavailable' as const;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    return outcome;
  }, [deferred]);

  return {
    isInstalled,
    canPrompt: Boolean(deferred),
    platform,
    isIosSafari,
    promptInstall,
  };
}
