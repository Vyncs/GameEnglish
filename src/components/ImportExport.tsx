import { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import type { ExportData } from '../types';
import { 
  Download, 
  Upload, 
  FileJson, 
  AlertCircle, 
  CheckCircle,
  X,
  Merge,
  Replace
} from 'lucide-react';

interface ImportExportProps {
  onClose: () => void;
}

export function ImportExport({ onClose }: ImportExportProps) {
  const { exportProgress, importProgress, validateImportData, groups, cards } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<ExportData | null>(null);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Exportar dados
  const handleExport = () => {
    const data = exportProgress();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `english-cards-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Selecionar arquivo
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setImportResult(null);
    setIsProcessing(true);

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const validation = validateImportData(data);
      
      setValidationResult(validation);
      if (validation.valid) {
        setFileData(data as ExportData);
      } else {
        setFileData(null);
      }
    } catch {
      setValidationResult({ valid: false, message: 'Erro ao ler arquivo: formato JSON inválido' });
      setFileData(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Importar dados
  const handleImport = () => {
    if (!fileData) return;
    
    setIsProcessing(true);
    const result = importProgress(fileData, importMode === 'merge');
    setImportResult(result);
    setIsProcessing(false);
    
    if (result.success) {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  // Resetar seleção
  const handleReset = () => {
    setSelectedFile(null);
    setFileData(null);
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
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-700">
                {groups.length} grupos • {cards.length} cards
              </span>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2"
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
            <p className="text-sm text-blue-600 mb-4">
              Selecione um arquivo JSON para importar seus dados.
            </p>

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
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-6 border-2 border-dashed border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-colors text-center"
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
                    <div>
                      <p className="text-sm font-medium">{validationResult.message}</p>
                      {validationResult.valid && fileData && (
                        <p className="text-xs mt-1 opacity-75">
                          {fileData.groups.length} grupos • {fileData.cards.length} cards
                        </p>
                      )}
                    </div>
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
        </div>
      </div>
    </div>
  );
}
