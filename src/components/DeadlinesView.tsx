import { useState } from 'react';
import { Calendar, Clock, AlertCircle, ArrowRight, MessageSquareText, ShieldAlert } from 'lucide-react';
import { DEADLINES } from '../data/knowledgeBase';
import { DeadlinesCountdownWidget } from './widgets/DeadlinesCountdownWidget';

interface Props {
  onAskAboutDeadline: (title: string) => void;
}

export function DeadlinesView({ onAskAboutDeadline }: Props) {
  const [filter, setFilter] = useState<'all' | 'academic' | 'financial' | 'internship' | 'graduation'>('all');

  const filtered = DEADLINES.filter(d => filter === 'all' || d.category === filter);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <Calendar className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Academic & Financial Deadlines Calendar
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Official Fall 2026 – Spring 2027 milestone dates. Late submissions or missed windows incur penalties.
        </p>
      </div>

      {/* Featured Immediate Countdown: Course Add/Drop */}
      <DeadlinesCountdownWidget
        targetDate="2026-10-24T23:59:59"
        title="Immediate Priority: Fall Course Add/Drop Period Closes"
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {(['all', 'academic', 'financial', 'internship', 'graduation'] as const).map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
              filter === cat
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Deadlines Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(item => {
          const formatted = new Date(item.dueDate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between space-y-3 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    item.urgency === 'high'
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300/40'
                      : item.urgency === 'medium'
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                  }`}>
                    {item.urgency} Urgency
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatted}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                <span className="capitalize text-[11px] text-zinc-400 font-medium">
                  {item.category} Domain
                </span>
                <button
                  type="button"
                  onClick={() => onAskAboutDeadline(`Tell me all policies, procedures and consequences regarding: ${item.title}`)}
                  className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  <MessageSquareText className="w-3.5 h-3.5" />
                  <span>Ask Bot</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
