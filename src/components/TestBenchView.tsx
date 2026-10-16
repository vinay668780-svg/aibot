import { useState } from 'react';
import {
  FlaskConical,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Search,
  Filter,
  Check,
  X,
  Sliders,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BookOpen,
  Briefcase,
  Calendar,
  Award,
  Loader2,
  FileCheck
} from 'lucide-react';
import type { Category, ChatSettings, TestResult } from '../types/chat';
import { TEST_BENCH_QUESTIONS } from '../data/knowledgeBase';

interface Props {
  settings: ChatSettings;
  onUpdateSettings: (settings: ChatSettings) => void;
  onSendToChat: (question: string) => void;
}

export function TestBenchView({ settings, onUpdateSettings, onSendToChat }: Props) {
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | Category | 'edge_cases' | 'failed'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Custom single question test sandbox
  const [customQuestion, setCustomQuestion] = useState('');
  const [customCategory, setCustomCategory] = useState<Category>('courses');
  const [customKeywords, setCustomKeywords] = useState('deadline, policy');
  const [customTesting, setCustomTesting] = useState(false);
  const [customResult, setCustomResult] = useState<any | null>(null);

  const runAllTests = async () => {
    setIsRunningAll(true);
    try {
      const res = await fetch('/api/test-bench/run-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });
      const data = await res.json();
      if (data.results) {
        setTestResults(data.results);
      }
    } catch (err) {
      console.error('Error running test bench:', err);
    } finally {
      setIsRunningAll(false);
    }
  };

  const runSingleCustomTest = async () => {
    if (!customQuestion.trim() || customTesting) return;
    setCustomTesting(true);
    try {
      // 1. Generate answer via /api/chat
      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: customQuestion,
          currentCategory: customCategory,
          settings
        })
      });
      const chatData = await chatRes.json();

      // 2. Evaluate with local keywords
      const keywords = customKeywords.split(',').map(s => s.trim()).filter(Boolean);
      const lowerAnswer = (chatData.text || '').toLowerCase();
      const matched = keywords.filter(kw => lowerAnswer.includes(kw.toLowerCase()));
      const missing = keywords.filter(kw => !lowerAnswer.includes(kw.toLowerCase()));
      const matchRate = keywords.length > 0 ? Math.round((matched.length / keywords.length) * 100) : 100;
      const categoryMatch = chatData.category === customCategory;

      let score = 0;
      if (categoryMatch) score += 30;
      score += Math.round((matchRate / 100) * 40);
      if (chatData.text?.length > 100) score += 15;
      if (chatData.sources?.length > 0) score += 15;
      score = Math.min(100, score);

      setCustomResult({
        question: customQuestion,
        generatedAnswer: chatData.text,
        actualCategory: chatData.category,
        categoryMatch,
        matchedKeywords: matched,
        missingKeywords: missing,
        keywordMatchRate: matchRate,
        score,
        passed: score >= 70,
        latencyMs: chatData.latencyMs || 250,
        modelUsed: chatData.modelUsed || 'Gemini 3.8 Flash'
      });
    } catch (err) {
      console.error('Failed to run custom test:', err);
    } finally {
      setCustomTesting(false);
    }
  };

  // Metrics
  const totalCompleted = testResults.length;
  const passedCount = testResults.filter(r => r.passed).length;
  const passRate = totalCompleted > 0 ? Math.round((passedCount / totalCompleted) * 100) : 0;
  const avgScore = totalCompleted > 0
    ? Math.round(testResults.reduce((acc, r) => acc + r.score, 0) / totalCompleted)
    : 0;
  const avgLatency = totalCompleted > 0
    ? Math.round(testResults.reduce((acc, r) => acc + r.latencyMs, 0) / totalCompleted)
    : 0;

  // Filtered results
  const filteredList = TEST_BENCH_QUESTIONS.map(q => {
    const res = testResults.find(r => r.questionId === q.id);
    return { ...q, result: res };
  }).filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'edge_cases') return item.isEdgeCase;
    if (activeFilter === 'failed') return item.result && !item.result.passed;
    return item.expectedCategory === activeFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header & Mission */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Quality Assurance & Test Bench
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-2xl">
            Test the student helpdesk chatbot with real-world scenarios across Courses, Internships, Deadlines, and Certificates to evaluate accuracy, completeness, and latency.
          </p>
        </div>

        <button
          type="button"
          onClick={runAllTests}
          disabled={isRunningAll}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md shadow-indigo-500/20 active:scale-98"
        >
          {isRunningAll ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Running Benchmark Suite...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Run All 12 Test Cases</span>
            </>
          )}
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Benchmark Tests</div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-1 font-mono">
            {totalCompleted > 0 ? `${totalCompleted} / 12` : '12 Available'}
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">4 Core categories + edge cases</div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Pass Rate (&gt;= 70%)</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {totalCompleted > 0 ? `${passRate}%` : '—'}
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">{passedCount} passing responses</div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Average Quality Score</div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1 font-mono">
            {totalCompleted > 0 ? `${avgScore} / 100` : '—'}
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Factual completeness & clarity</div>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Average AI Latency</div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 font-mono">
            {totalCompleted > 0 ? `${avgLatency} ms` : '—'}
          </div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Fast response turnaround</div>
        </div>
      </div>

      {/* Quality Improvement Controls Box */}
      <div className="p-4 sm:p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/50 via-white to-blue-50/30 dark:from-indigo-950/20 dark:via-zinc-900 dark:to-blue-950/20 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider mb-2">
          <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Response Quality Fine-Tuner</span>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4">
          Adjust the prompt instructions, tone preset, or inject real-time campus advisory notices to test how the response quality adapts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
              Active Tone Preset
            </label>
            <div className="flex gap-1.5">
              {(['concise', 'balanced', 'detailed'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, tone: t })}
                  className={`flex-1 py-1.5 px-2 text-xs rounded-lg border font-medium capitalize transition-all cursor-pointer ${
                    settings.tone === t
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 uppercase mb-1">
              Temporary Campus Advisory Injection
            </label>
            <input
              type="text"
              value={settings.customContext}
              onChange={(e) => onUpdateSettings({ ...settings, customContext: e.target.value })}
              placeholder="e.g. Due to storm, all Fall Add/Drop and Fee deadlines extended by 48 hours."
              className="w-full text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            activeFilter === 'all'
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          All (12)
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('courses')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            activeFilter === 'courses'
              ? 'bg-purple-600 text-white font-semibold'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Courses
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('internships')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            activeFilter === 'internships'
              ? 'bg-blue-600 text-white font-semibold'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Internships
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('deadlines')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            activeFilter === 'deadlines'
              ? 'bg-amber-600 text-white font-semibold'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Deadlines
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('certificates')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            activeFilter === 'certificates'
              ? 'bg-emerald-600 text-white font-semibold'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Certificates
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('edge_cases')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            activeFilter === 'edge_cases'
              ? 'bg-rose-600 text-white font-semibold'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Edge Cases
        </button>
      </div>

      {/* Test Questions List */}
      <div className="space-y-3">
        {filteredList.map((item) => {
          const res = item.result;
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-400">{item.id}</span>
                    <span className="capitalize px-2 py-0.5 rounded-md text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {item.expectedCategory}
                    </span>
                    {item.isEdgeCase && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300/40">
                        Edge Case
                      </span>
                    )}
                  </div>
                  <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.question}
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {item.description}
                  </p>
                </div>

                {/* Score & Status Preview */}
                <div className="flex items-center gap-3 shrink-0">
                  {res ? (
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-sm font-mono font-bold ${
                          res.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : res.score >= 60 ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                          Score: {res.score}/100
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400">
                          {res.latencyMs}ms • {res.keywordMatchRate}% keywords
                        </div>
                      </div>

                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        res.passed ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                      }`}>
                        {res.passed ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-400 italic">Ready to test</span>
                  )}

                  {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                </div>
              </div>

              {/* Expanded Inspection & Results Panel */}
              {isExpanded && (
                <div className="p-4 bg-zinc-50/70 dark:bg-zinc-800/40 border-t border-zinc-200 dark:border-zinc-800 space-y-4 text-xs">
                  {/* Expected Keywords */}
                  <div>
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">Expected Policy & Fact Keywords: </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {item.expectedKeywords.map(kw => {
                        const isMatched = res?.matchedKeywords?.includes(kw);
                        return (
                          <span
                            key={kw}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-mono ${
                              res
                                ? isMatched
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold'
                                  : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 line-through'
                                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                            }`}
                          >
                            {kw}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rubric Feedback Notes */}
                  {res?.feedbackNotes && (
                    <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">Rubric Feedback & Diagnostics:</span>
                      <ul className="list-disc list-inside mt-1 space-y-1 text-zinc-600 dark:text-zinc-400">
                        {res.feedbackNotes.map((note: string, idx: number) => (
                          <li key={idx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Generated Answer Content */}
                  {res?.generatedAnswer ? (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">Generated Helpdesk Answer:</span>
                        <button
                          type="button"
                          onClick={() => onSendToChat(item.question)}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                        >
                          Open in Live Chat
                        </button>
                      </div>
                      <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-sans leading-relaxed">
                        {res.generatedAnswer}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-zinc-400">Click &apos;Run All 12 Test Cases&apos; to benchmark this question.</span>
                      <button
                        type="button"
                        onClick={() => onSendToChat(item.question)}
                        className="px-3 py-1 rounded-md bg-indigo-600 text-white font-medium cursor-pointer"
                      >
                        Ask in Chat
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom Question Sandbox */}
      <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Interactive Custom Question Evaluator
          </h2>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Write any custom student query, assign expected keywords, and instantly evaluate response quality against our academic rubric.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Custom Student Query
            </label>
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="e.g. Can I submit my thesis if my tuition fees are delayed by a week?"
              className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Domain Category
            </label>
            <select
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value as Category)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="courses">Courses</option>
              <option value="internships">Internships</option>
              <option value="deadlines">Deadlines</option>
              <option value="certificates">Certificates</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Expected Keywords (comma-separated)
          </label>
          <input
            type="text"
            value={customKeywords}
            onChange={(e) => setCustomKeywords(e.target.value)}
            placeholder="e.g. thesis, accounts, Nov 5, clearance, advisor"
            className="w-full text-xs px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={runSingleCustomTest}
            disabled={!customQuestion.trim() || customTesting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
          >
            {customTesting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Evaluate Response Quality</span>
              </>
            )}
          </button>
        </div>

        {/* Custom Test Result Preview */}
        {customResult && (
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-3 text-xs mt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                  customResult.passed ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800'
                }`}>
                  {customResult.passed ? 'PASSED (≥ 70%)' : 'NEEDS REFINEMENT'}
                </span>
                <span className="text-zinc-500 font-mono">Score: {customResult.score}/100</span>
              </div>
              <span className="text-zinc-400 font-mono">{customResult.latencyMs}ms • {customResult.modelUsed}</span>
            </div>

            <div>
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Generated Response:</span>
              <div className="p-3 mt-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 whitespace-pre-wrap">
                {customResult.generatedAnswer}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="text-zinc-500">Matched Keywords:</span>
              {customResult.matchedKeywords.length > 0 ? (
                customResult.matchedKeywords.map((k: string) => (
                  <span key={k} className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono">
                    ✓ {k}
                  </span>
                ))
              ) : (
                <span className="text-zinc-400 italic">None</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
