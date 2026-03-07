import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function PoliticaPrivacidade() {
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

        <h1 className="text-3xl font-bold text-slate-800 mb-2">Política de Privacidade</h1>
        <p className="text-sm text-slate-400 mb-10">Última atualização: {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-600 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">1. Introdução</h2>
            <p>
              Esta Política de Privacidade descreve como a Play Flash Cards ("nós", "nosso") coleta, usa, armazena 
              e protege seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD) 
              e demais legislações aplicáveis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">2. Dados que Coletamos</h2>
            <p>Coletamos os seguintes dados pessoais:</p>

            <h3 className="text-base font-medium text-slate-700 mt-4 mb-2">2.1. Dados fornecidos pelo usuário</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Cadastro:</strong> nome, e-mail e senha (hash criptográfico);</li>
              <li><strong>Login social:</strong> dados públicos do perfil (Google, Facebook, Apple);</li>
              <li><strong>Conteúdo:</strong> cards, grupos e progresso de estudo criados pelo usuário.</li>
            </ul>

            <h3 className="text-base font-medium text-slate-700 mt-4 mb-2">2.2. Dados coletados automaticamente</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Dados de uso:</strong> páginas acessadas, funcionalidades utilizadas e tempo de sessão;</li>
              <li><strong>Dados técnicos:</strong> endereço IP, tipo de navegador, sistema operacional e dispositivo;</li>
              <li><strong>Cookies:</strong> identificadores armazenados no navegador para manter sua sessão e preferências.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">3. Finalidade do Tratamento</h2>
            <p>Utilizamos seus dados para:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Prestar e manter o serviço da Plataforma;</li>
              <li>Autenticar e proteger sua conta;</li>
              <li>Sincronizar seu progresso entre dispositivos;</li>
              <li>Processar pagamentos (via Mercado Pago ou Stripe);</li>
              <li>Enviar comunicações sobre o serviço (atualizações, segurança);</li>
              <li>Melhorar a experiência do usuário e desenvolver novos recursos;</li>
              <li>Cumprir obrigações legais e regulatórias.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">4. Base Legal (LGPD)</h2>
            <p>O tratamento dos seus dados é realizado com base em:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Consentimento</strong> (Art. 7º, I): para cookies não essenciais e comunicações de marketing;</li>
              <li><strong>Execução de contrato</strong> (Art. 7º, V): para prestação do serviço contratado;</li>
              <li><strong>Legítimo interesse</strong> (Art. 7º, IX): para melhoria do serviço e segurança;</li>
              <li><strong>Cumprimento de obrigação legal</strong> (Art. 7º, II): para obrigações fiscais e regulatórias.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">5. Cookies</h2>
            <p>Utilizamos cookies e tecnologias semelhantes para:</p>
            <table className="w-full mt-3 text-sm border border-slate-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-3 font-medium text-slate-700 border-b border-slate-200">Tipo</th>
                  <th className="text-left p-3 font-medium text-slate-700 border-b border-slate-200">Finalidade</th>
                  <th className="text-left p-3 font-medium text-slate-700 border-b border-slate-200">Obrigatório</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-b border-slate-100">Essenciais</td>
                  <td className="p-3 border-b border-slate-100">Autenticação, sessão e segurança</td>
                  <td className="p-3 border-b border-slate-100">Sim</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-slate-100">Preferências</td>
                  <td className="p-3 border-b border-slate-100">Tema, idioma e configurações do usuário</td>
                  <td className="p-3 border-b border-slate-100">Sim</td>
                </tr>
                <tr>
                  <td className="p-3">Analíticos</td>
                  <td className="p-3">Métricas de uso e desempenho</td>
                  <td className="p-3">Não (requer consentimento)</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-3">
              Você pode gerenciar cookies a qualquer momento pelas configurações do seu navegador. 
              A desativação de cookies essenciais pode comprometer o funcionamento da Plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">6. Compartilhamento de Dados</h2>
            <p>Seus dados podem ser compartilhados com:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Processadores de pagamento:</strong> Mercado Pago e Stripe (para processar transações);</li>
              <li><strong>Provedores de infraestrutura:</strong> serviços de hospedagem e banco de dados;</li>
              <li><strong>Provedores de login social:</strong> Google, Facebook, Apple (quando utilizado pelo usuário);</li>
              <li><strong>Autoridades competentes:</strong> quando exigido por lei ou ordem judicial.</li>
            </ul>
            <p className="mt-2">
              Não vendemos, alugamos ou compartilhamos seus dados pessoais para fins de marketing de terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">7. Seus Direitos (LGPD)</h2>
            <p>Nos termos da LGPD, você tem direito a:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Confirmar a existência de tratamento de seus dados;</li>
              <li>Acessar seus dados pessoais;</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;</li>
              <li>Solicitar a portabilidade dos dados;</li>
              <li>Revogar o consentimento a qualquer momento;</li>
              <li>Solicitar a exclusão de sua conta e dados pessoais.</li>
            </ul>
            <p className="mt-2">
              Para exercer seus direitos, entre em contato pelo WhatsApp:
              <a href="https://wa.me/5513988513127" target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline ml-1">
                +55 13 98851-3127
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">8. Segurança dos Dados</h2>
            <p>
              Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Criptografia de senhas (bcrypt);</li>
              <li>Comunicação segura via HTTPS/TLS;</li>
              <li>Tokens JWT com expiração para autenticação;</li>
              <li>Controle de acesso baseado em funções (roles).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">9. Retenção de Dados</h2>
            <p>
              Seus dados são armazenados enquanto sua conta estiver ativa. Após a exclusão da conta, 
              os dados serão removidos em até 30 dias, exceto quando houver obrigação legal de retenção.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">10. Transferência Internacional</h2>
            <p>
              Seus dados podem ser armazenados em servidores localizados fora do Brasil (serviços de cloud computing). 
              Nesses casos, garantimos que os provedores adotam nível adequado de proteção, conforme exigido pela LGPD.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">11. Alterações nesta Política</h2>
            <p>
              Esta Política pode ser atualizada periodicamente. Alterações significativas serão comunicadas 
              pela Plataforma. Recomendamos revisar esta página regularmente.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">12. Contato e Encarregado (DPO)</h2>
            <p>
              Para questões sobre privacidade e proteção de dados, entre em contato:
            </p>
            <p className="mt-2">
              WhatsApp:
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
