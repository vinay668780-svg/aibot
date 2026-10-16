import { X, Sliders, CheckCircle2, RotateCcw, Volume2, Mic, ShieldAlert } from 'lucide-react';
import type { ChatSettings } from '../types/chat';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: ChatSettings;
  onSaveSettings: (settings: ChatSettings) => void;
  hasGeminiKey: boolean;
}

export function SettingsModal({ isOpen, onClose, settings, onSaveSettings, hasGeminiKey }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-950 text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Advisory Configuration & Voice Preferences
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Configure voiceover narration, speech recognition, and regulatory depth
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Voiceover Settings */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-indigo-600" />
              <span>Voiceover Narration Options</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSaveSettings({ ...settings, voiceGender: 'female' })}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  settings.voiceGender === 'female'
                    ? 'border-indigo-900 bg-indigo-50 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 font-bold'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                }`}
              >
                <div className="text-xs">Dean Voice (Kore)</div>
                <div className="text-[11px] text-zinc-500">Female collegiate advisor</div>
              </button>

              <button
                type="button"
                onClick={() => onSaveSettings({ ...settings, voiceGender: 'male' })}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  settings.voiceGender === 'male'
                    ? 'border-indigo-900 bg-indigo-50 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 font-bold'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                }`}
              >
                <div className="text-xs">Registrar Voice (Puck)</div>
                <div className="text-[11px] text-zinc-500">Male collegiate officer</div>
              </button>
            </div>

            <div className="mt-2.5 flex items-center justify-between p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
              <span className="text-xs text-zinc-700 dark:text-zinc-300">
                Automatically read responses aloud
              </span>
              <input
                type="checkbox"
                checked={settings.autoSpeak}
                onChange={(e) => onSaveSettings({ ...settings, autoSpeak: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-900 focus:ring-indigo-900 cursor-pointer"
              />
            </div>
          </div>

          {/* Reasoning & Regulation Mode */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              Statutory Authority Mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onSaveSettings({ ...settings, mode: 'hybrid' })}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  settings.mode === 'hybrid'
                    ? 'border-indigo-900 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                }`}
              >
                <div className="text-xs font-bold mb-0.5">Hybrid Dean</div>
                <p className="text-[10px] text-zinc-500">Bylaws + Gemini AI</p>
              </button>

              <button
                type="button"
                onClick={() => onSaveSettings({ ...settings, mode: 'knowledge_base' })}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  settings.mode === 'knowledge_base'
                    ? 'border-indigo-900 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                }`}
              >
                <div className="text-xs font-bold mb-0.5">Strict Statutes</div>
                <p className="text-[10px] text-zinc-500">Codified bylaws only</p>
              </button>

              <button
                type="button"
                onClick={() => onSaveSettings({ ...settings, mode: 'ai' })}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  settings.mode === 'ai'
                    ? 'border-indigo-900 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                }`}
              >
                <div className="text-xs font-bold mb-0.5">Generative AI</div>
                <p className="text-[10px] text-zinc-500">Full conversational</p>
              </button>
            </div>
          </div>

          {/* Tone Preset */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              Advisory Formulation Tone
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['concise', 'balanced', 'detailed'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onSaveSettings({ ...settings, tone: t })}
                  className={`py-2 px-2 text-xs rounded-lg border capitalize text-center font-medium transition-all cursor-pointer ${
                    settings.tone === t
                      ? 'bg-indigo-950 text-white font-semibold shadow-xs'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                  }`}
                >
                  {t === 'concise' && 'Summary Bulletins'}
                  {t === 'balanced' && 'Standard Dean Advice'}
                  {t === 'detailed' && 'Comprehensive Bylaws'}
                </button>
              ))}
            </div>
          </div>

          {/* Temporary Campus Notice Injection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Temporary Dean Directive / Campus Advisory
              </label>
              {settings.customContext && (
                <button
                  type="button"
                  onClick={() => onSaveSettings({ ...settings, customContext: '' })}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
            <textarea
              rows={2}
              value={settings.customContext}
              onChange={(e) => onSaveSettings({ ...settings, customContext: e.target.value })}
              placeholder="e.g. All Fall Add/Drop and Fee payment penalties are waived through Nov 10 due to administrative system migration."
              className="w-full text-xs p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/40 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-950 text-white hover:bg-indigo-900 cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
