import { BarChart3, ExternalLink, Globe, MousePointer, Eye, Clock } from 'lucide-react';

export function AdminTrafficPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Tráfego / Analytics</h1>
        <p className="text-sm text-slate-500">Métricas de tráfego pago e orgânico</p>
      </header>

      {/* Integration CTA */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-slate-100 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
            <BarChart3 className="w-10 h-10 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-800 mb-1">Google Analytics</h2>
            <p className="text-sm text-slate-500 mb-3">
              Conecte sua conta do Google Analytics 4 para visualizar dados de tráfego diretamente aqui.
              Adicione o Measurement ID (G-XXXXXXXXXX) nas variáveis de ambiente do frontend.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://analytics.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                Abrir Google Analytics
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://support.google.com/analytics/answer/9304153"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
              >
                Guia de configuração
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Setup instructions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Como integrar</h3>
        <div className="space-y-4">
          <Step
            number={1}
            title="Criar propriedade no GA4"
            description='Acesse analytics.google.com → Admin → Criar propriedade → Escolha "Web" e adicione o domínio.'
          />
          <Step
            number={2}
            title="Copiar Measurement ID"
            description='Na propriedade criada, vá em Fluxos de dados → Web → copie o ID no formato G-XXXXXXXXXX.'
          />
          <Step
            number={3}
            title="Configurar variável de ambiente"
            description="Adicione VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX no .env do frontend e no Netlify."
          />
          <Step
            number={4}
            title="Adicionar script do GA"
            description="Adicione o script gtag.js no index.html ou use react-ga4 para rastrear eventos no SPA."
          />
        </div>
      </div>

      {/* Placeholder metric cards */}
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Métricas (após integração)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <PlaceholderCard icon={<Eye className="w-5 h-5 text-blue-600" />} title="Pageviews" color="bg-blue-50" />
        <PlaceholderCard icon={<Globe className="w-5 h-5 text-emerald-600" />} title="Sessões" color="bg-emerald-50" />
        <PlaceholderCard icon={<MousePointer className="w-5 h-5 text-violet-600" />} title="Taxa de Rejeição" color="bg-violet-50" />
        <PlaceholderCard icon={<Clock className="w-5 h-5 text-amber-600" />} title="Tempo Médio" color="bg-amber-50" />
      </div>

      {/* Paid traffic */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Tráfego Pago</h3>
        <p className="text-sm text-slate-500 mb-4">
          Integre com Google Ads, Meta Ads ou outras plataformas para visualizar métricas de campanhas pagas.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <PlatformCard
            name="Google Ads"
            description="CPC, CTR, Conversões"
            url="https://ads.google.com"
            color="from-blue-500 to-blue-600"
          />
          <PlatformCard
            name="Meta Ads"
            description="Facebook & Instagram Ads"
            url="https://business.facebook.com"
            color="from-indigo-500 to-purple-600"
          />
          <PlatformCard
            name="UTM Tracking"
            description="Rastreie campanhas com UTM"
            url="https://ga-dev-tools.google/ga4/campaign-url-builder/"
            color="from-emerald-500 to-teal-600"
          />
        </div>
      </div>
    </div>
  );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-8 h-8 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center text-sm font-bold border border-cyan-200">
        {number}
      </div>
      <div>
        <p className="font-medium text-slate-800 text-sm">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function PlaceholderCard({ icon, title, color }: { icon: React.ReactNode; title: string; color: string }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-dashed border-slate-200 hover:shadow-md transition-shadow">
      <div className={`p-2.5 rounded-xl ${color} w-fit mb-3`}>{icon}</div>
      <p className="text-2xl font-bold text-slate-300">—</p>
      <p className="text-sm text-slate-400 mt-0.5">{title}</p>
      <p className="text-xs text-slate-300 mt-1">Requer integração GA4</p>
    </div>
  );
}

function PlatformCard({ name, description, url, color }: { name: string; description: string; url: string; color: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl overflow-hidden border border-slate-100 hover:shadow-md transition-shadow"
    >
      <div className={`bg-gradient-to-r ${color} p-4`}>
        <p className="font-semibold text-white text-sm">{name}</p>
      </div>
      <div className="p-4 bg-white/80">
        <p className="text-xs text-slate-500">{description}</p>
        <span className="inline-flex items-center gap-1 text-xs text-cyan-600 mt-2 group-hover:underline">
          Acessar <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </a>
  );
}
