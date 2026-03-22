import { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import { hasPremiumAccess } from '../utils/subscription';
import { api } from '../api/client';
import type { NormalizedImportData } from '../types';
import { 
  Download, 
  Upload, 
  FileJson, 
  AlertCircle, 
  CheckCircle,
  X,
  Merge,
  Replace,
  FileDown
} from 'lucide-react';

const EXAMPLE_JSON = {
  groups: [
    {
      name: "Verbos Comuns",
      cards: [
        { pt: "correr", en: "to run" },
        { pt: "comer", en: "to eat", dica: "Irregular: eat / ate / eaten" },
        { pt: "dormir", en: "to sleep" },
        { pt: "falar", en: "to speak", dica: "Irregular: speak / spoke / spoken" }
      ]
    },
    {
      name: "Frases do Dia a Dia",
      cards: [
        { pt: "Bom dia!", en: "Good morning!" },
        { pt: "Como você está?", en: "How are you?" },
        { pt: "Eu não entendi", en: "I didn't understand", dica: "Também: I didn't get it" },
        { pt: "Com licença", en: "Excuse me" }
      ]
    }
  ]
};

interface ImportExportProps {
  onClose: () => void;
}

export function ImportExport({ onClose }: ImportExportProps) {
  const { user } = useAuthStore();
  const canSyncImportExport = hasPremiumAccess(user?.subscriptionStatus);
  const { exportProgress, validateImportData, normalizeImportData, hydrateFromSync, groups, cards } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [normalizedData, setNormalizedData] = useState<NormalizedImportData | null>(null);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = () => {
    const data = exportProgress();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `play-flash-cards-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadExample = () => {
    const blob = new Blob([JSON.stringify(EXAMPLE_JSON, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exemplo-importacao.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!canSyncImportExport) {
      setImportResult({
        success: false,
        message: 'Importação e exportação completas são para assinantes. Faça upgrade em Conta.',
      });
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    setImportResult(null);
    setIsProcessing(true);

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const validation = validateImportData(data);
      
      setValidationResult(validation);
      if (validation.valid) {
        const normalized = normalizeImportData(data);
        setNormalizedData(normalized);
      } else {
        setNormalizedData(null);
      }
    } catch {
      setValidationResult({ valid: false, message: 'Erro ao ler arquivo: formato JSON inválido' });
      setNormalizedData(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (!normalizedData) return;
    if (!canSyncImportExport) {
      setImportResult({
        success: false,
        message: 'Importação disponível apenas para assinantes.',
      });
      return;
    }

    const mergeMode = importMode === 'merge';
    const isLoggedIn = !!api.getToken();

    if (isLoggedIn) {
      setIsProcessing(true);
      try {
        const payload = {
          mode: importMode as 'replace' | 'merge',
          groups: mergeMode
            ? normalizedData.groups
                .filter((g) => !groups.some((eg) => eg.name.toLowerCase() === g.name.toLowerCase()))
                .map((g) => ({ name: g.name }))
            : normalizedData.groups.map((g) => ({ name: g.name })),
          cards: [] as { groupIndex: number; portuguesePhrase: string; englishPhrase: string; direction?: string; imageUrl?: string; tips?: string }[],
        };

        const targetGroups = mergeMode
          ? normalizedData.groups.filter((g) => !groups.some((eg) => eg.name.toLowerCase() === g.name.toLowerCase()))
          : normalizedData.groups;

        payload.cards = normalizedData.cards
          .filter((c) => targetGroups.some((g) => g.id === c.groupId))
          .map((c) => ({
            groupIndex: payload.groups.findIndex((pg) => pg.name === targetGroups.find((g) => g.id === c.groupId)?.name),
            portuguesePhrase: c.portuguesePhrase,
            englishPhrase: c.englishPhrase,
            direction: c.direction || 'pt-en',
            imageUrl: c.imageUrl,
            tips: c.tips,
          }))
          .filter((c) => c.groupIndex >= 0);

        await api.importSync(payload);
        const sync = await api.getSync();
        hydrateFromSync(sync);
        setImportResult({
          success: true,
          message: mergeMode
            ? 'Importação concluída! Dados mesclados e sincronizados com sua conta.'
            : `Importação concluída! ${normalizedData.groups.length} grupo(s) e ${normalizedData.cards.length} card(s) sincronizados.`,
        });
        setTimeout(() => onClose(), 2000);
      } catch {
        setImportResult({ success: false, message: 'Erro ao sincronizar com o servidor. Tente novamente.' });
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    setIsProcessing(true);
    const { importProgress } = useStore.getState();
    const result = importProgress(normalizedData, mergeMode);
    setImportResult(result);
    setIsProcessing(false);
    if (result.success) {
      setTimeout(() => onClose(), 2000);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setNormalizedData(null);
    setValidationResult(null);
    setImportResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-100 rounded-xl">
              <FileJson className="w-6 h-6 text-cyan-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Importar / Exportar</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Seção Exportar */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
            <h3 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Exportar Progresso
            </h3>
            <p className="text-sm text-emerald-600 mb-4">
              Baixe um arquivo JSON com todos os seus grupos e cards.
              {!canSyncImportExport && (
                <span className="block mt-2 text-amber-800">
                  Exportação completa disponível para assinantes.
                </span>
              )}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-700">
                {groups.length} grupo(s) · {cards.length} card(s)
              </span>
              <button
                onClick={handleExport}
                disabled={!canSyncImportExport}
                className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Exportar JSON
              </button>
            </div>
          </div>

          {/* Seção Importar */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Importar Progresso
            </h3>
            <p className="text-sm text-blue-600 mb-3">
              Selecione um arquivo JSON para importar seus dados.
              {!canSyncImportExport && (
                <span className="block mt-2 font-medium text-amber-800">
                  No plano free, importação está desativada. Assine para importar e exportar.
                </span>
              )}
            </p>

            {/* Botão baixar exemplo */}
            <button
              onClick={handleDownloadExample}
              className="w-full mb-4 px-4 py-2.5 bg-white border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <FileDown className="w-4 h-4" />
              Baixar JSON de exemplo
            </button>

            {/* Input de arquivo */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />

            {!selectedFile ? (
              <button
                onClick={() => canSyncImportExport && fileInputRef.current?.click()}
                disabled={!canSyncImportExport}
                className="w-full p-6 border-2 border-dashed border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <span className="text-blue-600 font-medium">Clique para selecionar arquivo</span>
                <p className="text-xs text-blue-400 mt-1">Apenas arquivos .json</p>
              </button>
            ) : (
              <div className="space-y-4">
                {/* Arquivo selecionado */}
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <FileJson className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="font-medium text-slate-700 text-sm truncate max-w-[200px]">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="p-1.5 hover:bg-slate-100 rounded-lg"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                {/* Validação */}
                {isProcessing && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Validando arquivo...</span>
                  </div>
                )}

                {validationResult && (
                  <div className={`flex items-start gap-2 p-3 rounded-lg ${
                    validationResult.valid 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {validationResult.valid ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm font-medium">{validationResult.message}</p>
                  </div>
                )}

                {/* Modo de importação */}
                {validationResult?.valid && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-700">Modo de importação:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setImportMode('merge')}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          importMode === 'merge'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Merge className={`w-5 h-5 mb-1 ${
                          importMode === 'merge' ? 'text-blue-600' : 'text-slate-400'
                        }`} />
                        <p className={`font-medium text-sm ${
                          importMode === 'merge' ? 'text-blue-700' : 'text-slate-600'
                        }`}>Mesclar</p>
                        <p className="text-xs text-slate-400">Adiciona novos dados</p>
                      </button>
                      <button
                        onClick={() => setImportMode('replace')}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          importMode === 'replace'
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Replace className={`w-5 h-5 mb-1 ${
                          importMode === 'replace' ? 'text-amber-600' : 'text-slate-400'
                        }`} />
                        <p className={`font-medium text-sm ${
                          importMode === 'replace' ? 'text-amber-700' : 'text-slate-600'
                        }`}>Substituir</p>
                        <p className="text-xs text-slate-400">Substitui todos os dados</p>
                      </button>
                    </div>
                    
                    {importMode === 'replace' && (
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-xs text-amber-700 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          Atenção: Esta ação irá substituir todos os dados existentes!
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Resultado da importação */}
                {importResult && (
                  <div className={`flex items-start gap-2 p-3 rounded-lg ${
                    importResult.success 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {importResult.success ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm font-medium">{importResult.message}</p>
                  </div>
                )}

                {/* Botão importar */}
                {validationResult?.valid && !importResult?.success && (
                  <button
                    onClick={handleImport}
                    disabled={isProcessing}
                    className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    Importar Dados
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Formato esperado */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Formato do JSON</h4>
            <pre className="text-xs text-slate-500 bg-white p-3 rounded-lg border border-slate-100 overflow-x-auto">
{`{
  "groups": [
    {
      "name": "Nome do Grupo",
      "cards": [
        { "pt": "português", "en": "english" },
        { "pt": "frase", "en": "phrase", "dica": "opcional" }
      ]
    }
  ]
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
