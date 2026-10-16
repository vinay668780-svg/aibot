import { BookOpen, Check, ArrowRight } from 'lucide-react';

interface Props {
  courseCode?: string;
  courseName?: string;
  prerequisites?: string[];
}

export function CoursePrereqWidget({
  courseCode = 'CS350',
  courseName = 'Artificial Intelligence & Machine Learning',
  prerequisites = ['CS201 Data Structures', 'MATH220 Linear Algebra']
}: Props) {
  return (
    <div className="mt-3 p-3.5 bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/30 rounded-xl">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Prerequisite Pathway ({courseCode})</span>
        </div>
        <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400">
          4.0 Credits • Senior Elective
        </span>
      </div>

      <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100 mb-2">
        Target Course: <span className="font-bold text-purple-600 dark:text-purple-400">{courseCode}</span> - {courseName}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 my-2 text-xs">
        {/* Prereq 1 */}
        <div className="w-full sm:w-auto flex-1 p-2 rounded-lg bg-white/80 dark:bg-zinc-800/80 border border-purple-500/20 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{prerequisites[0]}</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <Check className="w-3 h-3" /> Min Grade C
            </span>
          </div>
          <div className="text-[10px] text-zinc-500">Core CS Requirement</div>
        </div>

        <ArrowRight className="w-4 h-4 text-purple-400 shrink-0 hidden sm:block" />

        {/* Prereq 2 */}
        {prerequisites[1] && (
          <>
            <div className="w-full sm:w-auto flex-1 p-2 rounded-lg bg-white/80 dark:bg-zinc-800/80 border border-purple-500/20 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{prerequisites[1]}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <Check className="w-3 h-3" /> Min Grade C
                </span>
              </div>
              <div className="text-[10px] text-zinc-500">Math Foundation</div>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-400 shrink-0 hidden sm:block" />
          </>
        )}

        {/* Target */}
        <div className="w-full sm:w-auto flex-1 p-2 rounded-lg bg-purple-600 text-white shadow-xs">
          <div className="font-bold">{courseCode}</div>
          <div className="text-[10px] text-purple-200">Unlocked & Eligible</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
        <span>Prerequisite waiver available via HOD approval before Oct 24.</span>
        <span className="font-medium text-purple-600 dark:text-purple-400 cursor-pointer hover:underline">
          View Syllabus PDF
        </span>
      </div>
    </div>
  );
}
