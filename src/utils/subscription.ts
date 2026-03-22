/** Acesso completo ao app: assinatura paga ou VIP (cupom de professor / admin). */
export function hasPremiumAccess(subscriptionStatus: string | null | undefined): boolean {
  return subscriptionStatus === 'active' || subscriptionStatus === 'vip';
}
