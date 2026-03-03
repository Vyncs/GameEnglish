// Em dev com proxy do Vite use ''; em produção defina VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? '' : 'http://localhost:3001');
// Para login social o redirect deve ir ao backend (não ao proxy)
const AUTH_SOCIAL_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const TOKEN_KEY = 'english-cards-token';

export function getAuthSocialUrl(provider: 'google' | 'facebook' | 'apple'): string {
  return `${AUTH_SOCIAL_BASE}/api/auth/${provider}`;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText || 'Erro na requisição');
  return data as T;
}

export interface SyncData {
  groups: { id: string; name: string; createdAt: number }[];
  cards: {
    id: string; groupId: string; portuguesePhrase: string; englishPhrase: string;
    direction: string; level: number; lastReviewed: number | null; nextReview: number;
    errorCount: number; imageUrl?: string; tips?: string; createdAt: number;
  }[];
  selectedGroupId: string | null;
  memoryDecks: unknown[];
  hiddenDefaultDeckIds: string[];
  customBooks: unknown[];
  readerTheme: string;
}

export const api = {
  getToken,

  async getSync(): Promise<SyncData> {
    return request<SyncData>('GET', '/api/sync');
  },

  /** Importação em massa: envia grupos/cards para o backend e retorna os criados. Depois chame getSync() e hydrate. */
  async importSync(payload: {
    mode: 'replace' | 'merge';
    groups: { name: string }[];
    cards: { groupIndex: number; portuguesePhrase: string; englishPhrase: string; direction?: string; imageUrl?: string; tips?: string }[];
  }) {
    return request<{ groups: SyncData['groups']; cards: SyncData['cards'] }>('POST', '/api/sync/import', payload);
  },

  async postGroup(name: string) {
    return request<{ id: string; name: string; createdAt: number }>('POST', '/api/groups', { name });
  },
  async patchGroup(id: string, name: string) {
    return request<{ id: string; name: string; createdAt: number }>('PATCH', `/api/groups/${id}`, { name });
  },
  async deleteGroup(id: string) {
    return request<void>('DELETE', `/api/groups/${id}`);
  },

  async postCard(data: {
    groupId: string;
    portuguesePhrase: string;
    englishPhrase: string;
    direction?: string;
    imageUrl?: string;
    tips?: string;
  }) {
    return request<{
      id: string; groupId: string; portuguesePhrase: string; englishPhrase: string;
      direction: string; level: number; lastReviewed: number | null; nextReview: number;
      errorCount: number; imageUrl?: string; tips?: string; createdAt: number;
    }>('POST', '/api/cards', data);
  },
  async patchCard(id: string, data: Record<string, unknown>) {
    return request('PATCH', `/api/cards/${id}`, data);
  },
  async deleteCard(id: string) {
    return request<void>('DELETE', `/api/cards/${id}`);
  },

  async putMemory(data: { memoryDecks: unknown[]; hiddenDefaultDeckIds: string[] }) {
    return request<{ ok: boolean }>('PUT', '/api/memory', data);
  },
  async putBooks(data: { customBooks: unknown[] }) {
    return request<{ ok: boolean }>('PUT', '/api/books', data);
  },
  async putPreferences(data: { selectedGroupId?: string | null; readerTheme?: string }) {
    return request<{ ok: boolean }>('PUT', '/api/preferences', data);
  },

  async login(email: string, password: string) {
    return request<{ user: { id: string; email: string; name: string | null; subscriptionStatus: string | null }; token: string }>(
      'POST', '/api/auth/login', { email, password }
    );
  },
  async register(email: string, password: string, name?: string) {
    return request<{ user: { id: string; email: string; name: string | null; subscriptionStatus: string | null }; token: string }>(
      'POST', '/api/auth/register', { email, password, name }
    );
  },
  async getMe() {
    return request<{ user: { id: string; email: string; name: string | null; subscriptionStatus: string | null; subscriptionEndsAt?: string | null } }>(
      'GET', '/api/auth/me'
    );
  },

  /** plan: 'monthly' (R$ 19,99/mês) ou 'annual' (R$ 168/ano). Omitir = mensal */
  async createCheckoutSession(plan?: 'monthly' | 'annual') {
    return request<{ url: string }>('POST', '/api/payments/create-checkout-session', { plan: plan || 'monthly' });
  },
  async createPortalSession() {
    return request<{ url: string }>('POST', '/api/payments/create-portal-session');
  },
  /** Só em dev: simula notificação do Mercado Pago e ativa a assinatura do usuário logado */
  async simulateMercadoPagoNotification() {
    return request<{ ok: boolean; message?: string }>('POST', '/api/payments/mercadopago/simulate-notification');
  },
  /** Só em dev: volta o usuário para plano gratuito (para testar disables de features) */
  async simulateClearSubscription() {
    return request<{ ok: boolean; message?: string }>('POST', '/api/payments/mercadopago/simulate-clear-subscription');
  },
};
