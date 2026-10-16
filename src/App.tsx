import { useState, useEffect, useRef } from 'react';
import type { Category, ChatMessage, ChatSettings } from './types/chat';
import { Navbar } from './components/Navbar';
import { ChatView } from './components/ChatView';
import { TestBenchView } from './components/TestBenchView';
import { DeadlinesView } from './components/DeadlinesView';
import { KnowledgeExplorerView } from './components/KnowledgeExplorerView';
import { SettingsModal } from './components/SettingsModal';
import { AdvisorDirectoryModal } from './components/AdvisorDirectoryModal';
import { playSpeech, stopAllSpeech } from './utils/voice-service';

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-msg',
  sender: 'bot',
  text: `### Office of Academic Advising & Registrar Services (AARSO)
**Metro State University • Central Student Records & Curricular Authority**

Welcome to the official digital advisory desk. We provide formal institutional guidance, regulatory interpretations, and credentialing clearances across all academic divisions:

- 📚 **Course Enrollment & Registration (Bylaw § 4.14)**: Add/Drop adjustments through **October 24, 2026** (100% refund, no transcript notation), prerequisite verification for advanced electives, and term credit limits (12.0 min full-time to 18.0 cap).
- 💼 **Industrial Internships & Practicums (Directive 2026/08)**: Mandatory eligibility clearance (Junior/Senior standing, minimum 6.50 CGPA, zero backlogs), No Objection Certificates (NOC), and experiential academic credit defense.
- ⏰ **Statutory Calendar Deadlines**: Add/Drop closure (Oct 24), Tuition & Institutional Fee Settlement (Nov 5, with $50/week late surcharge), Mid-semester proctored exams (Nov 10–18), and Thesis filings (Dec 15).
- 📜 **Official University Credentials & Transcripts (Statutes 101 & 304)**: Cryptographically verified digital Bonafide certificates, official sealed transcript packets, and degree clearance protocols.

Select a specialized advising domain above, dictate your question with the microphone, or review codified university bylaws below.`,
  timestamp: Date.now(),
  category: 'general',
  sources: [
    { title: 'University Academic Regulations & Bylaw Compendium', section: 'Statutes § 4.14 & § 6.11' }
  ],
  suggestedFollowUps: [
    'When is the course Add/Drop deadline, and how are late drops handled?',
    'What are the prerequisites for AI and Machine Learning (CS350)?',
    'What are the mandatory CGPA and offer letter criteria for an Internship NOC?',
    'How do I order official sealed transcripts for WES or foreign admissions?'
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'test-bench' | 'deadlines' | 'knowledge'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdvisorDirectoryOpen, setIsAdvisorDirectoryOpen] = useState(false);

  // Voiceover playback state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentlySpeakingMessageId, setCurrentlySpeakingMessageId] = useState<string | null>(null);
  const stopSpeechRef = useRef<(() => void) | null>(null);

  const [settings, setSettings] = useState<ChatSettings>({
    tone: 'balanced',
    mode: 'hybrid',
    customContext: '',
    autoSpeak: false,
    voiceGender: 'female'
  });

  // Check server health and Gemini availability
  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(data => {
        if (data.hasGeminiKey) {
          setHasGeminiKey(true);
        }
      })
      .catch(() => {});
  }, []);

  const handleStopVoiceover = () => {
    if (stopSpeechRef.current) {
      stopSpeechRef.current();
      stopSpeechRef.current = null;
    }
    stopAllSpeech();
    setIsSpeaking(false);
    setCurrentlySpeakingMessageId(null);
  };

  const handlePlayVoiceover = async (text: string, messageId: string) => {
    handleStopVoiceover();
    setIsSpeaking(true);
    setCurrentlySpeakingMessageId(messageId);

    const cancelFn = await playSpeech(
      text,
      settings.voiceGender,
      () => {
        setIsSpeaking(true);
        setCurrentlySpeakingMessageId(messageId);
      },
      () => {
        setIsSpeaking(false);
        setCurrentlySpeakingMessageId(null);
        stopSpeechRef.current = null;
      }
    );

    stopSpeechRef.current = cancelFn;
  };

  const handleSendMessage = async (text: string, category?: Category) => {
    if (!text.trim() || isLoading) return;

    handleStopVoiceover();

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
      category
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages,
          currentCategory: category,
          settings
        })
      });

      const data = await response.json();
      const botMsgId = `bot-${Date.now()}`;

      const botMessage: ChatMessage = {
        id: botMsgId,
        sender: 'bot',
        text: data.text || 'We are unable to locate the designated statute in the registrar archive. Please consult your faculty academic advisor.',
        timestamp: Date.now(),
        category: data.category,
        sources: data.sources,
        suggestedFollowUps: data.suggestedFollowUps,
        widgetType: data.widgetType,
        widgetData: data.widgetData,
        latencyMs: data.latencyMs,
        modelUsed: data.modelUsed
      };

      setMessages(prev => [...prev, botMessage]);

      // If user enabled autoSpeak in settings, trigger voiceover
      if (settings.autoSpeak && botMessage.text) {
        handlePlayVoiceover(botMessage.text, botMsgId);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: 'The advisory portal is currently operating in offline mode. Please review statutory deadlines or contact the Registrar Desk directly at Administration Hall Room 101.',
        timestamp: Date.now(),
        category: 'general'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRateMessage = (messageId: string, rating: 'like' | 'dislike') => {
    setMessages(prev =>
      prev.map(m =>
        m.id === messageId
          ? { ...m, helpfulFeedback: m.helpfulFeedback === rating ? null : rating }
          : m
      )
    );
  };

  const handleSendToTestBench = (question: string) => {
    setActiveTab('test-bench');
  };

  const handleClearChat = () => {
    handleStopVoiceover();
    setMessages([INITIAL_WELCOME_MESSAGE]);
  };

  const handleAskQuestionFromHandbook = (query: string, category: Category) => {
    setActiveTab('chat');
    handleSendMessage(query, category);
  };

  const handleAskAboutDeadline = (title: string) => {
    setActiveTab('chat');
    handleSendMessage(`Provide full statutory guidelines, deadlines, and procedural requirements for: ${title}`, 'deadlines');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-indigo-900 selection:text-white">
      {/* Institutional Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasGeminiKey={hasGeminiKey}
        settings={settings}
        onUpdateSettings={setSettings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDirectory={() => setIsAdvisorDirectoryOpen(true)}
        isSpeaking={isSpeaking}
        onStopSpeaking={handleStopVoiceover}
      />

      {/* Main Advisory Content */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'chat' && (
          <ChatView
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onClearChat={handleClearChat}
            onRateMessage={handleRateMessage}
            onSendToTestBench={handleSendToTestBench}
            onPlayVoiceover={handlePlayVoiceover}
            onStopVoiceover={handleStopVoiceover}
            currentlySpeakingMessageId={currentlySpeakingMessageId}
            onOpenDirectory={() => setIsAdvisorDirectoryOpen(true)}
            settings={settings}
          />
        )}

        {activeTab === 'test-bench' && (
          <TestBenchView
            settings={settings}
            onUpdateSettings={setSettings}
            onSendToChat={(q) => {
              setActiveTab('chat');
              handleSendMessage(q);
            }}
          />
        )}

        {activeTab === 'deadlines' && (
          <DeadlinesView onAskAboutDeadline={handleAskAboutDeadline} />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeExplorerView onAskQuestion={handleAskQuestionFromHandbook} />
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Staff & Department Directory Modal */}
      <AdvisorDirectoryModal
        isOpen={isAdvisorDirectoryOpen}
        onClose={() => setIsAdvisorDirectoryOpen(false)}
        onSelectDepartmentForQuery={(queryPrefix) => {
          setIsAdvisorDirectoryOpen(false);
          setActiveTab('chat');
          handleSendMessage(`${queryPrefix} course registration and degree clearance guidelines`);
        }}
      />
    </div>
  );
}
