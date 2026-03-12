import { BarChart3, ExternalLink, Globe, MousePointer, Eye, Clock, CheckCircle2 } from 'lucide-react';

const GA_MEASUREMENT_ID = 'G-FVBYGCXZ55';

export function AdminTrafficPage() {
  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Tráfego / Analytics</h1>
        <p className="text-sm text-slate-500">Métricas de tráfego pago e orgânico</p>
      </header>

      {/* GA Connected */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-emerald-200 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
            <BarChart3 className="w-10 h-10 text-emerald-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold text-slate-800">Google Analytics</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Conectado
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-1">
              O Google Analytics 4 está integrado e coletando dados de tráfego.
            </p>
            <p className="text-xs text-slate-400 mb-3">
              Measurement ID: <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">{GA_MEASUREMENT_ID}</code>
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://analytics.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Abrir Google Analytics
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href={`https://analytics.google.com/analytics/web/#/report-home/${GA_MEASUREMENT_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
              >
                Ver Relatórios
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick metrics info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Dica:</strong> Acesse o painel do Google Analytics para visualizar métricas detalhadas como pageviews, sessões, taxa de rejeição e tempo médio. Os dados começam a aparecer em até 24-48 horas após a integração.
        </p>
      </div>

      {/* Metric cards */}
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Métricas Principais</h3>
      <p className="text-sm text-slate-500 mb-4">Visualize as métricas em tempo real no painel do Google Analytics.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard icon={<Eye className="w-5 h-5 text-blue-600" />} title="Pageviews" color="bg-blue-50" />
        <MetricCard icon={<Globe className="w-5 h-5 text-emerald-600" />} title="Sessões" color="bg-emerald-50" />
        <MetricCard icon={<MousePointer className="w-5 h-5 text-violet-600" />} title="Taxa de Rejeição" color="bg-violet-50" />
        <MetricCard icon={<Clock className="w-5 h-5 text-amber-600" />} title="Tempo Médio" color="bg-amber-50" />
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

function MetricCard({ icon, title, color }: { icon: React.ReactNode; title: string; color: string }) {
  return (
    <a
      href="https://analytics.google.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer"
    >
      <div className={`p-2.5 rounded-xl ${color} w-fit mb-3`}>{icon}</div>
      <p className="text-sm font-medium text-slate-700 mt-0.5">{title}</p>
      <span className="inline-flex items-center gap-1 text-xs text-cyan-600 mt-2 group-hover:underline">
        Ver no GA4 <ExternalLink className="w-3 h-3" />
      </span>
    </a>
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
