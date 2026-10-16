import { useState } from 'react';
import { Briefcase, CheckSquare, Square, CheckCircle2, ArrowRight } from 'lucide-react';

export function InternshipChecklistWidget() {
  const [items, setItems] = useState([
    { id: 1, text: 'Enrolled in 3rd or 4th Year of Degree Program', checked: true },
    { id: 2, text: 'Cumulative GPA (CGPA) is 6.50 or higher', checked: true },
    { id: 3, text: 'Zero active academic backlogs or disciplinary holds', checked: true },
    { id: 4, text: 'Official Offer Letter on company letterhead with dates & stipend', checked: false },
    { id: 5, text: 'T&P Portal NOC Application submitted before Nov 20 deadline', checked: false }
  ]);

  const toggle = (id: number) => {
    setItems(items.map(it => it.id === id ? { ...it, checked: !it.checked } : it));
  };

  const completedCount = items.filter(it => it.checked).length;
  const isAllEligible = completedCount >= 4;

  return (
    <div className="mt-3 p-3.5 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/30 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Internship NOC Eligibility Checklist</span>
        </div>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
          {completedCount}/{items.length} Ready
        </span>
      </div>

      <div className="space-y-1.5 my-2">
        {items.map(it => (
          <button
            key={it.id}
            type="button"
            onClick={() => toggle(it.id)}
            className="w-full flex items-center gap-2.5 p-1.5 rounded-lg text-left hover:bg-blue-50/50 dark:hover:bg-zinc-800/50 transition-colors text-xs cursor-pointer"
          >
            {it.checked ? (
              <CheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-zinc-400 shrink-0" />
            )}
            <span className={`flex-1 ${it.checked ? 'text-zinc-800 dark:text-zinc-200 font-medium' : 'text-zinc-500 dark:text-zinc-400'}`}>
              {it.text}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-blue-500/20">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
          {isAllEligible ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Ready to submit NOC
            </span>
          ) : (
            <span>Complete items to request NOC letter</span>
          )}
        </div>
        <a
          href="#internship-portal"
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          <span>Open T&P Portal</span>
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
