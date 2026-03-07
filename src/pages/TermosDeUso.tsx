import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function TermosDeUso() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <h1 className="text-3xl font-bold text-slate-800 mb-2">Termos de Uso</h1>
        <p className="text-sm text-slate-400 mb-10">Última atualização: {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar a plataforma Play Flash Cards ("Plataforma"), você concorda integralmente com estes Termos de Uso. 
              Caso não concorde com quaisquer disposições aqui descritas, não utilize a Plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">2. Descrição do Serviço</h2>
            <p>
              A Play Flash Cards é uma plataforma de estudo de inglês que oferece flash cards com repetição espaçada, 
              jogos interativos e leitura guiada. O serviço está disponível em modalidade gratuita e paga (Pro).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">3. Cadastro e Conta</h2>
            <p>
              Para utilizar a Plataforma, é necessário criar uma conta fornecendo dados verdadeiros e atualizados. 
              Você é responsável pela segurança de suas credenciais de acesso e por todas as atividades realizadas em sua conta.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">4. Planos e Pagamentos</h2>
            <p>
              A Plataforma oferece um plano gratuito com funcionalidades limitadas e planos pagos (Pro) com acesso completo. 
              Os pagamentos são processados por terceiros (Mercado Pago e/ou Stripe) e seguem as políticas de cada processador.
            </p>
            <p className="mt-2">
              A assinatura Pro é recorrente e pode ser cancelada a qualquer momento. Após o cancelamento, 
              o acesso aos recursos Pro permanece ativo até o fim do período já pago. Não há reembolso proporcional.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">5. Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo da Plataforma (código, design, textos, marcas e logotipos) é de propriedade exclusiva 
              da Play Flash Cards. É proibida a reprodução, distribuição ou modificação sem autorização prévia.
            </p>
            <p className="mt-2">
              O conteúdo criado pelo usuário (cards, grupos) permanece de propriedade do usuário, 
              que concede à Plataforma licença para armazenar e processar esses dados para prestação do serviço.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">6. Uso Aceitável</h2>
            <p>O usuário se compromete a:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Não utilizar a Plataforma para fins ilegais ou não autorizados;</li>
              <li>Não tentar acessar sistemas ou dados de outros usuários;</li>
              <li>Não realizar engenharia reversa do software;</li>
              <li>Não compartilhar credenciais de acesso com terceiros;</li>
              <li>Não utilizar bots ou scripts automatizados sem autorização.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">7. Limitação de Responsabilidade</h2>
            <p>
              A Plataforma é fornecida "como está". Não garantimos disponibilidade ininterrupta ou ausência de erros. 
              Não nos responsabilizamos por perdas de dados decorrentes de falhas técnicas, caso fortuito ou força maior.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">8. Encerramento de Conta</h2>
            <p>
              Reservamo-nos o direito de suspender ou encerrar contas que violem estes Termos. 
              O usuário pode solicitar a exclusão de sua conta e dados a qualquer momento, 
              conforme previsto na Lei Geral de Proteção de Dados (LGPD).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">9. Alterações nos Termos</h2>
            <p>
              Podemos atualizar estes Termos a qualquer momento. Alterações significativas serão comunicadas 
              por meio da Plataforma. O uso continuado após as alterações constitui aceitação dos novos Termos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">10. Legislação Aplicável</h2>
            <p>
              Estes Termos são regidos pelas leis da República Federativa do Brasil. 
              Fica eleito o foro da Comarca de Santos/SP para dirimir quaisquer controvérsias.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">11. Contato</h2>
            <p>
              Em caso de dúvidas sobre estes Termos, entre em contato pelo WhatsApp: 
              <a href="https://wa.me/5513988513127" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline ml-1">
                +55 13 98851-3127
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
