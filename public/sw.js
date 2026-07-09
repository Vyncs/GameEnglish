// Service worker mínimo para habilitar a instalação do PWA (Add to Home Screen).
// Estratégia conservadora: network-first para navegação, com fallback offline.
// Não faz cache agressivo de assets versionados do Vite para evitar conteúdo desatualizado.

const CACHE = 'pfc-shell-v1';
const OFFLINE_URL = '/';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.add(OFFLINE_URL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Só tratamos GET; o resto (POST de login etc.) segue direto para a rede.
  if (request.method !== 'GET') return;

  // Navegações (abrir o app): tenta a rede; se estiver offline, serve o shell em cache.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(OFFLINE_URL, copy));
          return response;
        })
        .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Ícones/manifest: cache-first para funcionar offline na tela inicial.
  const url = new URL(request.url);
  if (/\/(icon-\d+|icon-maskable-\d+|apple-touch-icon)\.png$/.test(url.pathname) ||
      url.pathname === '/manifest.webmanifest') {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached ||
        fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
      )
    );
  }
  // Demais requisições seguem o comportamento padrão do navegador.
});
