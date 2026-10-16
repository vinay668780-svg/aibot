import { useState, useRef, useEffect } from 'react';
import {
  Send,
  BookOpen,
  Briefcase,
  Calendar,
  Award,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  RotateCcw,
  FlaskConical,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Building2,
  CalendarCheck,
  ChevronRight,
  ShieldCheck,
  Loader2,
  Radio
} from 'lucide-react';
import type { Category, ChatMessage, ChatSettings } from '../types/chat';
import { MarkdownRenderer } from './MarkdownRenderer';
import { DeadlinesCountdownWidget } from './widgets/DeadlinesCountdownWidget';
import { CertificateStepperWidget } from './widgets/CertificateStepperWidget';
import { InternshipChecklistWidget } from './widgets/InternshipChecklistWidget';
import { CoursePrereqWidget } from './widgets/CoursePrereqWidget';
import { startVoiceRecognition } from '../utils/voice-service';

interface Props {
  messages: ChatMessage[];
  onSendMessage: (text: string, category?: Category) => Promise<void>;
  isLoading: boolean;
  onClearChat: () => void;
  onRateMessage: (messageId: string, rating: 'like' | 'dislike') => void;
  onSendToTestBench: (question: string) => void;
  onPlayVoiceover: (text: string, messageId: string) => void;
  onStopVoiceover: () => void;
  currentlySpeakingMessageId: string | null;
  onOpenDirectory: () => void;
  settings: ChatSettings;
}

const CATEGORY_TABS: { id: Category; label: string; icon: any; code: string }[] = [
  { id: 'courses', label: 'Course Enrollment', icon: BookOpen, code: 'Bylaw § 4.14' },
  { id: 'internships', label: 'Internships & NOC', icon: Briefcase, code: 'Directive 2026/08' },
  { id: 'deadlines', label: 'Statutory Deadlines', icon: Calendar, code: 'Calendar 2026-27' },
  { id: 'certificates', label: 'Credentials & Transcripts', icon: Award, code: 'Statute 1.04' },
];

const CURATED_PROMPTS = [
  { label: 'Course Add/Drop Period & Late Drops', query: 'When is the official Fall 2026 Add/Drop deadline, and what are the transcript and refund implications if dropped in November?' },
  { label: 'Prerequisites for CS350 Machine Learning', query: 'What are the required prerequisite courses, minimum letter grades, and waiver procedures for CS350 Artificial Intelligence & Machine Learning?' },
  { label: 'Internship NOC Protocol & CGPA Criteria', query: 'What are the mandatory eligibility criteria, offer letter requirements, and procedure for obtaining an Internship NOC from the T&P Cell?' },
  { label: 'Tuition Fee Deadlines & Late Penalties', query: 'What is the statutory tuition fee payment due date for Fall 2026, and what are the specific weekly late penalty assessments?' },
  { label: 'Official Transcript Ordering (WES/Courier)', query: 'How do I order official sealed academic transcripts for foreign university evaluation (WES) and what are the dispatch timelines?' },
  { label: 'Bonafide Student Certificate Issuance', query: 'How can I obtain an official digitally signed Bonafide Student Certificate with QR verification for bank account or visa purposes?' },
];

export function ChatView({
  messages,
  onSendMessage,
  isLoading,
  onClearChat,
  onRateMessage,
  onSendToTestBench,
  onPlayVoiceover,
  onStopVoiceover,
  currentlySpeakingMessageId,
  onOpenDirectory,
  settings
}: Props) {
  const [input, setInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const stopListeningRef = useRef<(() => void) | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput('');
    onSendMessage(text, selectedCategory === 'all' ? undefined : selectedCategory);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleVoiceRecognition = () => {
    if (isListening) {
      if (stopListeningRef.current) {
        stopListeningRef.current();
        stopListeningRef.current = null;
      }
      setIsListening(false);
      return;
    }

    setVoiceError(null);
    setIsListening(true);

    const cancel = startVoiceRecognition(
      (transcript, isFinal) => {
        setInput(prev => {
          if (isFinal) {
            return prev ? `${prev} ${transcript}` : transcript;
          }
          return transcript;
        });
      },
      (err) => {
        setVoiceError(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
        stopListeningRef.current = null;
      }
    );

    stopListeningRef.current = cancel;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-5xl mx-auto px-4 sm:px-6 w-full">
      {/* Category Navigation Bar */}
      <div className="py-2.5 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-indigo-950 text-white shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            All Advising Desks
          </button>

          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-900 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-bold shadow-xs'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className="text-[10px] opacity-60 font-mono hidden md:inline">({tab.code})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenDirectory}
            className="hidden sm:inline-flex items-center gap-1 text-xs text-indigo-700 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Staff Directory</span>
          </button>

          {messages.length > 1 && (
            <button
              type="button"
              onClick={onClearChat}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset Session</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Thread */}
      <div className="flex-1 overflow-y-auto py-4 space-y-5">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          const isCurrentAudio = currentlySpeakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              {/* Message Bubble Container */}
              <div
                className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-4 sm:p-5 shadow-xs border ${
                  msg.sender === 'user'
                    ? 'bg-indigo-900 text-white border-indigo-900 rounded-br-xs'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-xs'
                }`}
              >
                {/* Official Department Stamp (Bot messages) */}
                {isBot && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-zinc-100 dark:border-zinc-800 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"></div>
                      <span className="font-serif font-bold text-zinc-900 dark:text-zinc-100">
                        Office of Academic Advising & Registrar Services
                      </span>
                      {msg.category && (
                        <span className="capitalize px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold border border-zinc-200 dark:border-zinc-700">
                          {msg.category}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Message Voiceover Audio Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (isCurrentAudio) {
                            onStopVoiceover();
                          } else {
                            onPlayVoiceover(msg.text, msg.id);
                          }
                        }}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all cursor-pointer ${
                          isCurrentAudio
                            ? 'bg-rose-50 border border-rose-300 text-rose-700 font-bold'
                            : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-300'
                        }`}
                        title={isCurrentAudio ? 'Stop narration' : 'Listen to advisor voiceover'}
                      >
                        {isCurrentAudio ? (
                          <>
                            <VolumeX className="w-3 h-3 text-rose-600" />
                            <span>Stop Voice</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                            <span>Listen</span>
                          </>
                        )}
                      </button>

                      {msg.latencyMs && (
                        <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">
                          ⚡ {msg.latencyMs}ms
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Formatted Text Content */}
                <div className="text-xs sm:text-sm leading-relaxed font-sans">
                  {msg.sender === 'user' ? (
                    <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
                  ) : (
                    <MarkdownRenderer content={msg.text} />
                  )}
                </div>

                {/* Rich Contextual Widgets */}
                {msg.widgetType === 'deadline-timer' && msg.widgetData && (
                  <DeadlinesCountdownWidget
                    targetDate={msg.widgetData.targetDate || '2026-11-05T23:59:59'}
                    title={msg.widgetData.title || 'Official Academic Deadline'}
                  />
                )}

                {msg.widgetType === 'certificate-stepper' && (
                  <CertificateStepperWidget
                    certificateType={msg.widgetData?.certificateType}
                    processingTime={msg.widgetData?.processingTime}
                    fee={msg.widgetData?.fee}
                  />
                )}

                {msg.widgetType === 'internship-checklist' && (
                  <InternshipChecklistWidget />
                )}

                {msg.widgetType === 'course-prereq' && (
                  <CoursePrereqWidget
                    courseCode={msg.widgetData?.courseCode}
                    courseName={msg.widgetData?.courseName}
                    prerequisites={msg.widgetData?.prerequisites}
                  />
                )}

                {/* Official Sources & Bylaws Citation */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">Statutory Citations: </span>
                    {msg.sources.map((s, idx) => (
                      <span key={s.title}>
                        {idx > 0 && ' • '}
                        <span className="underline underline-offset-2 decoration-zinc-300 dark:decoration-zinc-700">
                          {s.title} ({s.section})
                        </span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Institutional Actions: Copy, Thumbs Up/Down, In-Person Booking */}
                {isBot && (
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="p-1 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        title="Copy text to clipboard"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <div className="h-3 w-px bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

                      <button
                        type="button"
                        onClick={() => onRateMessage(msg.id, 'like')}
                        className={`p-1 rounded transition-colors ${
                          msg.helpfulFeedback === 'like'
                            ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950 font-bold'
                            : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                        }`}
                        title="Mark advice as accurate and helpful"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onRateMessage(msg.id, 'dislike')}
                        className={`p-1 rounded transition-colors ${
                          msg.helpfulFeedback === 'dislike'
                            ? 'text-rose-700 bg-rose-50 dark:bg-rose-950 font-bold'
                            : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                        }`}
                        title="Flag for registrar administrative review"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={onOpenDirectory}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        <CalendarCheck className="w-3 h-3" />
                        <span>Book In-Person Advisor</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSendToTestBench(msg.text)}
                        className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:underline cursor-pointer"
                      >
                        <FlaskConical className="w-3 h-3" />
                        <span>Audit Accuracy</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Follow-up Statutory Questions */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[88%]">
                  {msg.suggestedFollowUps.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => onSendMessage(prompt, msg.category)}
                      className="px-2.5 py-1 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer text-left"
                    >
                      § {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 max-w-sm shadow-xs text-xs text-zinc-600 dark:text-zinc-400">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-900 dark:text-indigo-400" />
            <span>Consulting Registrar Academic Archives & Student Statutes...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Recognition Active Listening Alert */}
      {isListening && (
        <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl flex items-center justify-between text-xs text-rose-800 dark:text-rose-200 animate-pulse my-1">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-600 animate-spin" />
            <span className="font-semibold">Microphone Active — Speak your question clearly...</span>
          </div>
          <button
            type="button"
            onClick={toggleVoiceRecognition}
            className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold cursor-pointer hover:bg-rose-700"
          >
            Done Speaking
          </button>
        </div>
      )}

      {voiceError && (
        <div className="p-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 rounded-lg text-xs text-amber-800 dark:text-amber-200 my-1">
          {voiceError}
        </div>
      )}

      {/* Input Form Bar with Microphone & Send */}
      <div className="py-2.5 border-t border-zinc-200 dark:border-zinc-800">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? 'Listening to speech...'
                : selectedCategory !== 'all'
                ? `Inquire with the ${selectedCategory} desk (e.g., bylaws, deadlines, waivers)...`
                : 'Enter query for Academic Advising & Registrar Services (or click mic to speak)...'
            }
            className="w-full pl-4 pr-24 py-3 text-xs sm:text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-900/20 focus:border-indigo-900 resize-none shadow-xs font-sans"
          />

          <div className="absolute right-2 flex items-center gap-1">
            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleVoiceRecognition}
              aria-label={isListening ? 'Stop listening' : 'Start voice speech recognition'}
              title={isListening ? 'Stop speech recognition' : 'Dictate question via voice'}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white animate-bounce'
                  : 'text-zinc-500 hover:text-indigo-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send Query Button */}
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Submit inquiry"
              className="p-2 rounded-lg bg-indigo-950 hover:bg-indigo-900 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mt-1.5 px-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              Institutional Bylaws Verified
            </span>
          </div>
          <span>Office Hours: Mon–Fri, 8:30 AM – 5:00 PM EST</span>
        </div>
      </div>
    </div>
  );
}
