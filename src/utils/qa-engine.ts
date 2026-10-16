import type { Category } from '../types/chat.ts';
import type { FAQItem } from '../data/knowledgeBase.ts';
import { KNOWLEDGE_BASE, DEADLINES } from '../data/knowledgeBase.ts';

export interface EvaluationResult {
  score: number; // 0-100
  passed: boolean;
  actualCategory: Category;
  categoryMatch: boolean;
  keywordMatchRate: number; // 0-100
  matchedKeywords: string[];
  missingKeywords: string[];
  feedbackNotes: string[];
}

/**
 * Classifies a user query into one of the core university domains:
 * courses, internships, deadlines, certificates, or general.
 */
export function classifyCategory(query: string): Category {
  const lower = query.toLowerCase();

  const certificateSignals = [
    'certificate', 'bonafide', 'transcript', 'transcripts', 'provisional', 
    'degree scroll', 'migration', 'marksheet', 'gradesheet', 'degree verification',
    'attestation', 'character certificate', 'medium of instruction', 'moi'
  ];

  const internshipSignals = [
    'internship', 'intern', 'noc', 'no objection', 't&p', 'placement',
    'training', 'stipend', 'company offer', 'wfh', 'remote intern',
    'industrial project', 'summer intern'
  ];

  const deadlineSignals = [
    'deadline', 'last date', 'due date', 'due', 'calendar', 'when is the last',
    'cut off', 'penalty date', 'late fee', 'schedule', 'finals date', 'midterm date',
    'when is', 'cutoff'
  ];

  const courseSignals = [
    'course', 'courses', 'subject', 'subjects', 'prereq', 'prerequisite',
    'add/drop', 'add drop', 'syllabus', 'credits', 'enrollment', 'register course',
    'class', 'grade w', 'withdrawal', 'curriculum', 'cs350', 'cs201', 'cs101'
  ];

  // Specific high-priority compound matches
  if (lower.includes('noc') || lower.includes('internship') || lower.includes('intern')) {
    return 'internships';
  }
  if (lower.includes('bonafide') || lower.includes('transcript') || lower.includes('no dues') || lower.includes('provisional degree') || (lower.includes('certificate') && !lower.includes('deadline'))) {
    return 'certificates';
  }
  if (lower.includes('degree') && (lower.includes('clearance') || lower.includes('convocation') || lower.includes('certificate') || lower.includes('issuance'))) {
    return 'certificates';
  }
  if (lower.includes('deadline') || lower.includes('last date') || lower.includes('due date') || lower.includes('last day')) {
    // If specifically asking about course add/drop/registration dates
    if (lower.includes('add') || lower.includes('drop') || lower.includes('course') || lower.includes('prereq') || lower.includes('class')) {
      return 'courses';
    }
    return 'deadlines';
  }

  // Count scoring
  let scores: Record<Category, number> = {
    certificates: 0,
    internships: 0,
    deadlines: 0,
    courses: 0,
    general: 0
  };

  for (const s of certificateSignals) {
    if (lower.includes(s)) scores.certificates += 2;
  }
  for (const s of internshipSignals) {
    if (lower.includes(s)) scores.internships += 2;
  }
  for (const s of deadlineSignals) {
    if (lower.includes(s)) scores.deadlines += 2;
  }
  for (const s of courseSignals) {
    if (lower.includes(s)) scores.courses += 2;
  }

  let topCategory: Category = 'general';
  let highestScore = 0;

  for (const [cat, score] of Object.entries(scores) as [Category, number][]) {
    if (score > highestScore) {
      highestScore = score;
      topCategory = cat;
    }
  }

  return highestScore > 0 ? topCategory : 'general';
}

/**
 * Searches the university knowledge base using weighted keyword and variation scoring.
 */
export function searchKnowledgeBase(query: string, categoryFilter?: Category): FAQItem | null {
  const lowerQuery = query.toLowerCase();
  const queryTokens = lowerQuery.split(/[\s,?.!-]+/).filter(Boolean);

  let bestMatch: FAQItem | null = null;
  let highestScore = 0;

  const candidateItems = categoryFilter && categoryFilter !== 'general'
    ? KNOWLEDGE_BASE.filter(item => item.category === categoryFilter)
    : KNOWLEDGE_BASE;

  for (const item of candidateItems) {
    let score = 0;

    // Direct variation match
    for (const variation of item.questionVariations) {
      const lowerVar = variation.toLowerCase();
      if (lowerQuery.includes(lowerVar) || lowerVar.includes(lowerQuery)) {
        score += 15;
      }
    }

    // Title match
    const lowerTitle = item.title.toLowerCase();
    for (const token of queryTokens) {
      if (token.length > 2 && lowerTitle.includes(token)) {
        score += 4;
      }
    }

    // Keyword match
    for (const kw of item.keywords) {
      const lowerKw = kw.toLowerCase();
      if (lowerQuery.includes(lowerKw)) {
        score += 5;
      }
      for (const token of queryTokens) {
        if (token.length > 3 && lowerKw.includes(token)) {
          score += 2;
        }
      }
    }

    // Category boost
    if (categoryFilter && item.category === categoryFilter) {
      score += 3;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  return highestScore >= 4 ? bestMatch : null;
}

/**
 * Evaluates the quality, category fidelity, and keyword coverage of a response.
 */
export function evaluateResponseQuality(
  question: string,
  answer: string,
  expectedCategory: Category,
  expectedKeywords: string[]
): EvaluationResult {
  const lowerAnswer = answer.toLowerCase();
  const actualCategory = classifyCategory(question);
  const categoryMatch = actualCategory === expectedCategory;

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of expectedKeywords) {
    if (lowerAnswer.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  const keywordMatchRate = expectedKeywords.length > 0
    ? Math.round((matchedKeywords.length / expectedKeywords.length) * 100)
    : 100;

  const feedbackNotes: string[] = [];
  let score = 0;

  // 1. Category Accuracy (30 pts)
  if (categoryMatch) {
    score += 30;
    feedbackNotes.push('Matched correct domain classification.');
  } else {
    feedbackNotes.push(`Category mismatch: detected ${actualCategory}, expected ${expectedCategory}.`);
  }

  // 2. Keyword & Concept Completeness (40 pts)
  const keywordPoints = Math.round((keywordMatchRate / 100) * 40);
  score += keywordPoints;
  if (keywordMatchRate >= 75) {
    feedbackNotes.push(`Strong factual coverage (${keywordMatchRate}% required terms present).`);
  } else {
    feedbackNotes.push(`Missing key factual terms: ${missingKeywords.join(', ')}.`);
  }

  // 3. Structure, Clarity & Actionability (20 pts)
  let structurePoints = 0;
  if (answer.includes('\n') || answer.includes('###') || answer.includes('**')) {
    structurePoints += 8;
  }
  if (/\d+\.\s|\*\s|-\s/.test(answer)) {
    structurePoints += 6; // Lists or numbered steps
  }
  if (answer.length >= 120 && answer.length <= 1600) {
    structurePoints += 6; // Reasonable length, not empty and not over-bloated
  }
  score += structurePoints;

  // 4. Policy/Source attribution presence (10 pts)
  if (answer.toLowerCase().includes('policy') || answer.toLowerCase().includes('handbook') || answer.toLowerCase().includes('portal') || answer.toLowerCase().includes('office') || answer.toLowerCase().includes('section')) {
    score += 10;
    feedbackNotes.push('Includes verifiable administrative reference / source pointer.');
  }

  const finalScore = Math.min(100, Math.max(0, score));
  const passed = finalScore >= 70 && keywordMatchRate >= 50;

  return {
    score: finalScore,
    passed,
    actualCategory,
    categoryMatch,
    keywordMatchRate,
    matchedKeywords,
    missingKeywords,
    feedbackNotes
  };
}

/**
 * Returns formatted deterministic response according to tone
 */
export function formatAnswerWithTone(faq: FAQItem, tone: 'balanced' | 'concise' | 'detailed'): string {
  if (tone === 'concise') {
    return `**Summary**: ${faq.summary}\n\n*Official Policy: ${faq.policyCode}*`;
  }
  if (tone === 'detailed') {
    return `${faq.detailedAnswer}\n\n---\n**Administrative Citation**: ${faq.policyCode} (${faq.sources.map(s => `${s.title} - ${s.section}`).join('; ')})`;
  }
  return faq.detailedAnswer;
}

/**
 * Returns list of upcoming deadlines sorted by earliest date
 */
export function getUpcomingDeadlines() {
  const now = Date.now();
  return [...DEADLINES].sort((a, b) => a.timestamp - b.timestamp);
}
