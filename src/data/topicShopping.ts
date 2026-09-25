import type { Topic } from './topic';

// Tópico: 25 palavras de compras e dinheiro — loja, preço e pagamento.
// Sem passado/particípio → não usa a etapa "Formas".

export const TOPIC_SHOPPING: Topic = {
  id: 'shopping-01-25',
  title: 'Compras e dinheiro',
  subtitle: 'shop → afford · 25 palavras',
  emoji: '🛒',
  category: 'cotidiano',
  level: 2,
  stages: ['study', 'meaning'],
  items: [
    { id: 1, base: 'shop', pt: 'loja; fazer compras', example: 'I shop online.', tip: 'Substantivo e verbo. No americano a loja costuma ser "store".' },
    { id: 2, base: 'store', pt: 'loja', example: 'The store opens at nine.', tip: 'Como verbo significa armazenar.' },
    { id: 3, base: 'buy', pt: 'comprar', example: 'I bought a new phone.', tip: 'Passado e particípio: bought. Soa igual a "by".' },
    { id: 4, base: 'sell', pt: 'vender', example: 'They sell shoes here.', tip: 'Passado e particípio: sold. Não confunda com "cell".' },
    { id: 5, base: 'pay', pt: 'pagar', example: 'I paid with my card.', tip: 'Passado: paid. Pagar por algo = "pay for it".' },
    { id: 6, base: 'price', pt: 'preço', example: 'What is the price?', tip: 'Preço de serviço/taxa é "fee"; tarifa de transporte é "fare".' },
    { id: 7, base: 'cheap', pt: 'barato', example: 'This one is cheaper.', tip: 'Pode soar como "de má qualidade". Elogio de preço é "affordable" ou "a good deal".' },
    { id: 8, base: 'expensive', pt: 'caro', example: 'That car is too expensive.', tip: 'Adjetivo longo: comparativo com "more expensive", nunca "expensiver".' },
    { id: 9, base: 'money', pt: 'dinheiro', example: 'I do not have money.', tip: 'Incontável: nunca "moneys". Muito dinheiro = "a lot of money".' },
    { id: 10, base: 'cash', pt: 'dinheiro em espécie', example: 'Can I pay in cash?', tip: 'Cash é a nota física; money é dinheiro em geral.' },
    { id: 11, base: 'change', pt: 'troco; trocar, mudar', example: 'Here is your change.', tip: 'Três sentidos: troco, trocar e mudar.' },
    { id: 12, base: 'card', pt: 'cartão', example: 'I lost my credit card.', tip: 'Cartão de débito = "debit card"; no caixa dizem "credit or debit?".' },
    { id: 13, base: 'receipt', pt: 'recibo, nota fiscal', example: 'Keep the receipt.', tip: 'O "p" é mudo: "ri-SSIT".' },
    { id: 14, base: 'discount', pt: 'desconto', example: 'They gave me a discount.', tip: 'Liquidação é "sale". "On sale" = em promoção.' },
    { id: 15, base: 'sale', pt: 'liquidação, venda', example: 'The shoes are on sale.', tip: 'Cuidado: "for sale" = à venda; "on sale" = com desconto.' },
    { id: 16, base: 'free', pt: 'grátis; livre', example: 'Delivery is free.', tip: 'Dois sentidos: de graça e livre.' },
    { id: 17, base: 'size', pt: 'tamanho', example: 'Do you have a bigger size?', tip: 'Provar roupa = "try it on".' },
    { id: 18, base: 'clothes', pt: 'roupas', example: 'I need new clothes.', tip: 'Sempre plural: nunca "a clothes". Uma peça = "a piece of clothing".' },
    { id: 19, base: 'shoes', pt: 'sapatos', example: 'These shoes are too small.', tip: 'Par de sapatos = "a pair of shoes".' },
    { id: 20, base: 'customer', pt: 'cliente (de loja)', example: 'The customer is waiting.', tip: 'Cliente de serviço profissional é "client".' },
    { id: 21, base: 'cashier', pt: 'caixa (pessoa)', example: 'Pay the cashier, please.', tip: 'O balcão do caixa é "the checkout" ou "the register".' },
    { id: 22, base: 'refund', pt: 'reembolso', example: 'I want a refund.', tip: 'Trocar o produto = "exchange"; devolver = "return".' },
    { id: 23, base: 'spend', pt: 'gastar', example: 'I spent too much money.', tip: 'Passado: spent. Serve para dinheiro e tempo: "spend time".' },
    { id: 24, base: 'save', pt: 'economizar; salvar', example: 'I am saving money for a trip.', tip: 'Economizar, guardar arquivo e salvar alguém — a mesma palavra.' },
    { id: 25, base: 'afford', pt: 'ter condições de pagar', example: "I can't afford it.", tip: 'Quase sempre com can/could: "I can\'t afford it" — não tenho como pagar.' },
  ],
};
