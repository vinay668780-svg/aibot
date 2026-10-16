import {
  MessageSquareText,
  FlaskConical,
  Calendar,
  BookOpen,
  Settings,
  GraduationCap,
  Building2,
  Volume2,
  VolumeX,
  PhoneCall
} from 'lucide-react';
import type { ChatSettings } from '../types/chat';

interface Props {
  activeTab: 'chat' | 'test-bench' | 'deadlines' | 'knowledge';
  setActiveTab: (tab: 'chat' | 'test-bench' | 'deadlines' | 'knowledge') => void;
  hasGeminiKey: boolean;
  settings: ChatSettings;
  onUpdateSettings: (settings: ChatSettings) => void;
  onOpenSettings: () => void;
  onOpenDirectory: () => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  hasGeminiKey,
  settings,
  onUpdateSettings,
  onOpenSettings,
  onOpenDirectory,
  isSpeaking,
  onStopSpeaking
}: Props) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-xs">
      {/* Top University Institutional Ribbon */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-100 uppercase tracking-widest text-[10px]">
            Metro State University
          </span>
          <span className="text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-400">
            Office of the Registrar & Academic Advising Center (AARSO)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenDirectory}
            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3 h-3 text-indigo-400" />
            <span className="hidden sm:inline">Advising Directory & Office Hours</span>
            <span className="sm:hidden">Directory</span>
          </button>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Fall 2026 Term Active
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-2 sm:gap-4">
          {/* Logo & Seal */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-950 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
                  CampusAssist
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                  Advisory Portal
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-indigo-900 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <MessageSquareText className="w-3.5 h-3.5" />
              <span>Advisory Desk</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('test-bench')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'test-bench'
                  ? 'bg-indigo-900 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Quality Test Bench</span>
              <span className="sm:hidden">Audit</span>
              <span className="hidden md:inline-flex px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                QA
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('deadlines')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'deadlines'
                  ? 'bg-indigo-900 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              <span>Deadlines</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('knowledge')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'knowledge'
                  ? 'bg-indigo-900 text-white shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">Statutes & Bylaws</span>
              <span className="sm:hidden">Bylaws</span>
            </button>
          </nav>

          {/* Voiceover & Settings Controls */}
          <div className="flex items-center gap-1.5">
            {/* Audio Voiceover Toggle */}
            <button
              type="button"
              onClick={() => {
                if (isSpeaking) {
                  onStopSpeaking();
                } else {
                  onUpdateSettings({ ...settings, autoSpeak: !settings.autoSpeak });
                }
              }}
              title={
                isSpeaking
                  ? 'Stop Current Audio Voiceover'
                  : settings.autoSpeak
                  ? 'Voiceover Enabled (Click to disable auto-narration)'
                  : 'Enable Voiceover Narration'
              }
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                isSpeaking
                  ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                  : settings.autoSpeak
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                  : 'bg-zinc-100 dark:bg-zinc-800 border-transparent text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                  <span className="hidden md:inline font-bold">Stop Audio</span>
                </>
              ) : settings.autoSpeak ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden md:inline">Voice: On</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="hidden md:inline">Voice: Off</span>
                </>
              )}
            </button>

            {/* Quality & Tone Settings */}
            <button
              type="button"
              onClick={onOpenSettings}
              aria-label="Advisory Settings & Bylaw Parameters"
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
