export type Category = 'courses' | 'internships' | 'deadlines' | 'certificates' | 'general';

export interface SourceReference {
  title: string;
  section: string;
  code?: string;
  url?: string;
}

export interface QuickAction {
  label: string;
  prompt: string;
  category: Category;
  bylawRef?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: number;
  category?: Category;
  sources?: SourceReference[];
  latencyMs?: number;
  modelUsed?: string;
  helpfulFeedback?: 'like' | 'dislike' | null;
  suggestedFollowUps?: string[];
  widgetType?: 'deadline-timer' | 'certificate-stepper' | 'internship-checklist' | 'course-prereq' | 'appointment-booking' | null;
  widgetData?: any;
  audioBase64?: string | null;
  isAudioPlaying?: boolean;
}

export interface ChatSettings {
  tone: 'balanced' | 'concise' | 'detailed';
  mode: 'ai' | 'knowledge_base' | 'hybrid';
  customContext: string;
  autoSpeak: boolean;
  voiceGender: 'female' | 'male';
}

export interface TestBenchItem {
  id: string;
  question: string;
  expectedCategory: Category;
  expectedKeywords: string[];
  description: string;
  isEdgeCase?: boolean;
}

export interface TestResult {
  questionId: string;
  question: string;
  passed: boolean;
  actualCategory: Category;
  score: number; // 0-100
  latencyMs: number;
  generatedAnswer: string;
  keywordMatchRate: number; // 0-100%
  categoryMatch: boolean;
  feedbackNotes: string[];
}

export interface DeadlineItem {
  id: string;
  title: string;
  category: 'academic' | 'financial' | 'graduation' | 'internship';
  dueDate: string;
  timestamp: number;
  description: string;
  actionUrl?: string;
  urgency: 'high' | 'medium' | 'normal';
  bylawCode: string;
}

export interface DepartmentContact {
  id: string;
  department: string;
  officer: string;
  title: string;
  room: string;
  phone: string;
  email: string;
  officeHours: string;
}
