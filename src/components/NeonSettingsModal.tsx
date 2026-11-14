import React, { useState } from 'react';
import { Database, X, CheckCircle2, AlertTriangle, ShieldCheck, ExternalLink, Loader2 } from 'lucide-react';
import { NeonConfig } from '../types';
import { StorageService } from '../services/storage';

interface NeonSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: NeonConfig;
  onSaveConfig: (config: NeonConfig) => void;
}

export const NeonSettingsModal: React.FC<NeonSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [dbUrl, setDbUrl] = useState(config.databaseUrl || '');
  const [isEnabled, setIsEnabled] = useState(config.isEnabled);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!dbUrl.trim()) {
      setTestResult({ success: false, message: 'Digite ou cole a URL de conexão do Neon.' });
      return;
    }

    setTesting(true);
    setTestResult(null);
    const res = await StorageService.testNeonConnection(dbUrl.trim());
    setTestResult(res);
    setTesting(false);

    if (res.success) {
      setIsEnabled(true);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      databaseUrl: dbUrl.trim(),
      isEnabled: isEnabled && !!dbUrl.trim(),
      lastSyncAt: config.lastSyncAt
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-sheikah-card border border-sheikah-border rounded-2xl shadow-2xl p-6 overflow-hidden">
        
        {/* Glow de fundo */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-sheikah-border pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-sheikah-gold flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white font-hylian">Configuração do Neon DB</h3>
              <p className="text-xs text-gray-400">Banco de Dados PostgreSQL Serverless na Nuvem</p>
            </div>
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          
          <div className="p-3 rounded-xl bg-sheikah-darkest/90 border border-sheikah-border/80 text-xs text-gray-300 space-y-1.5 leading-relaxed">
            <p className="flex items-center gap-1.5 text-sheikah-gold font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Sincronização em Nuvem Opcional</span>
            </p>
            <p>
              Ao conectar o Neon, o Zelda Notes sincroniza suas notas, checklists e registros para que você possa acessá-los de qualquer dispositivo ou celular pela internet.
            </p>
            <a 
              href="https://neon.tech" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sheikah-kokiri hover:underline pt-1"
            >
              <span>Criar conta gratuita no Neon (neon.tech)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-3 rounded-lg bg-sheikah-darkest border border-sheikah-border text-xs text-gray-300 leading-relaxed">
            A conexão com o Neon PostgreSQL é feita de forma segura pelo servidor (<code className="text-sheikah-gold">/api/sync</code>) usando a variável de ambiente <code className="text-sheikah-gold">DATABASE_URL</code> configurada na Vercel.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTest}
              disabled={testing}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-200 text-xs font-semibold border border-zinc-600 flex items-center gap-1.5 disabled:opacity-50 transition-colors"
            >
              {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
              <span>{testing ? 'Testando Conexão...' : 'Testar Conexão'}</span>
            </button>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 font-medium ml-auto select-none">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="rounded border-sheikah-border text-sheikah-gold focus:ring-0 w-4 h-4"
              />
              <span>Ativar Sincronização</span>
            </label>
          </div>

          {/* Resultado do Teste */}
          {testResult && (
            <div className={`p-3 rounded-lg text-xs border flex items-start gap-2 ${
              testResult.success 
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40' 
                : 'bg-red-950/40 text-red-300 border-red-500/40'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-sheikah-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-sheikah-gold hover:bg-amber-400 text-sheikah-darkest font-bold text-xs transition-colors shadow-glow-gold"
            >
              Salvar Configuração
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

