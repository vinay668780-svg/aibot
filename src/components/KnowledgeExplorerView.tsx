import { useState } from 'react';
import { BookOpen, Search, FileText, ChevronRight, MessageSquareText, ShieldCheck } from 'lucide-react';
import { KNOWLEDGE_BASE } from '../data/knowledgeBase';
import type { Category } from '../types/chat';

interface Props {
  onAskQuestion: (query: string, category: Category) => void;
}

export function KnowledgeExplorerView({ onAskQuestion }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | Category>('all');

  const filtered = KNOWLEDGE_BASE.filter(item => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = !searchTerm.trim() ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Student Handbook & Policy Explorer
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Search codified university policies, regulations, and procedures powering the CampusAssist chatbot.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search rules, prerequisites, NOC, fees, certificates..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['all', 'courses', 'internships', 'deadlines', 'certificates'] as const).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filtered.map(faq => (
          <div
            key={faq.id}
            className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3 shadow-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="capitalize px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {faq.category}
                </span>
                <span className="font-mono text-[10px] text-zinc-400">
                  Policy: {faq.policyCode}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onAskQuestion(faq.questionVariations[0] || faq.title, faq.category)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                <MessageSquareText className="w-3.5 h-3.5" />
                <span>Ask Helpdesk AI</span>
              </button>
            </div>

            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {faq.title}
            </h3>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {faq.summary}
            </p>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
              <div className="flex flex-wrap gap-1">
                {faq.keywords.map(kw => (
                  <span key={kw} className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-[10px] text-zinc-500">
                    #{kw}
                  </span>
                ))}
              </div>

              <div className="text-[11px]">
                Source: {faq.sources[0]?.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
