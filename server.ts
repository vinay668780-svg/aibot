import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { KNOWLEDGE_BASE, DEADLINES, TEST_BENCH_QUESTIONS } from './src/data/knowledgeBase.ts';
import { classifyCategory, searchKnowledgeBase, evaluateResponseQuality, formatAnswerWithTone } from './src/utils/qa-engine.ts';
import type { Category, ChatSettings } from './src/types/chat.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

import { DEPARTMENT_DIRECTORY } from './src/data/knowledgeBase.ts';

// Professional Academic Dean & University Registrar advisory context
const UNIVERSITY_KNOWLEDGE_CONTEXT = `
You are the Senior Academic Dean & Registrar Advisory Service for Metro State University (Office of Academic Records & Student Services).
Your duty is to provide authoritative, unambiguous, rigorous, and student-supportive advisory guidance regarding university bylaws, curriculum requirements, off-campus internships, and official credentialing.

GOVERNING MANDATES & STATUTORY FRAMEWORK:
1. COURSES & REGISTRATION (Bylaw § 4.14 & § 4.22):
   - Fall Add/Drop Deadline: October 24, 2026 at 11:59 PM EST. Complete erasure from transcript, 100% tuition liability adjustment.
   - Course Withdrawal Period: October 25 to November 28, 2026. Permanent notation "W" (Withdrawn) on transcript; zero quality points; does NOT affect Cumulative or Semester GPA; 0% refund.
   - Semester Credit Loads: Full-time status minimum 12.0 credits (F-1 visa / NCAA compliance). Standard maximum 18.0 credits. Credit overload up to 21.0 credits permitted only with CGPA >= 3.50 and Dean approval.
   - Prerequisites: CS350 (AI & Machine Learning) strictly mandates CS201 (Data Structures) and MATH220 (Linear Algebra) with minimum grade C (2.0). Waivers require Department Chair endorsement (Room 305).

2. INDUSTRIAL INTERNSHIPS & PRACTICUM (T&P Directive 2026/08):
   - Mandatory Eligibility: Year 3 (Junior) or Year 4 (Senior) standing, Cumulative GPA >= 6.50/10.0, zero active backlogs or disciplinary holds.
   - NOC Issuance: Apply via T&P Portal with corporate offer letter stating dates, stipend (>= $500/mo), and supervisor info. Turnaround: 3 working days with HOD digital endorsement.
   - Academic Credits: 4.0 credits for 8-week summer internship (viva defense in early Fall); 12.0 credits for 6-month final-semester capstone practicum.
   - Concurrent Term Internships: Maximum 20.0 hours/week. Mandatory minimum 75.0% physical classroom attendance. Corporate duties do not constitute excused absences.
   - Spring Placement Filing Deadline: November 20, 2026 (5:00 PM EST).

3. STATUTORY ACADEMIC & FINANCIAL DEADLINES:
   - Oct 24, 2026 (11:59 PM): Fall Course Add/Drop Period Closes (100% refund).
   - Nov 05, 2026 (11:59 PM): Tuition & Institutional Fee Settlement (Late fee of $50.00/week applies starting Nov 6; accounts suspended after Nov 20).
   - Nov 10 – Nov 18, 2026: Mid-Semester Proctored Examination Period.
   - Nov 20, 2026 (5:00 PM): Spring Internship NOC Application Filing Deadline.
   - Nov 28, 2026 (11:59 PM): Course Withdrawal (Grade "W") Closes.
   - Dec 15, 2026 (6:00 PM): Senior Capstone Project & Masters Thesis Archival Repository Filing.
   - Dec 20, 2026 (5:00 PM): Interdepartmental No-Dues Clearance for Convocation & Degree Conferral.

4. OFFICIAL UNIVERSITY CERTIFICATES (Statutes REG-DOC-101, REG-TRN-304, COMMENCE-1.04):
   - Bonafide Student Certificate: Instant generation via Student Portal with cryptographic SHA-256 QR code verification, or 24-hour physical sealed letter at Administration Hall Room 101. Free for first 5 copies.
   - Official Academic Transcripts: eTranscripts via Parchment dispatched within 48 hours; sealed paper envelope packets prepared in 3 to 5 business days ($10.00 first set, $5.00 duplicates). Direct electronic integration with WES, LSAC, and AMCAS.
   - Provisional Degree Certificate: Issued within 7 business days following degree audit and electronic No-Dues clearance across Library, Labs, Housing, and Bursar Accounts.

COMMUNICATION DISCIPLINE:
- NEVER state "As an AI...", "I am an AI assistant...", "Certainly! I'd be happy to help...", or "I am a chatbot".
- Speak directly in the professional, authoritative, and welcoming voice of the University Academic Advisory & Registrar Administration.
- Always provide structured, concrete information with official policy codes (e.g. REG-BYLAW-4.14, TNP-DIRECTIVE-2026-08), exact calendar dates, and next procedural steps.
- Maintain a distinguished, professional collegiate tone.
`;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
      model: 'gemini-3.8-flash',
      deadlinesCount: DEADLINES.length,
      faqCount: KNOWLEDGE_BASE.length,
    });
  });

  // Upcoming deadlines endpoint
  app.get('/api/deadlines', (req: Request, res: Response) => {
    res.json(DEADLINES);
  });

  // Department directory endpoint
  app.get('/api/directory', (req: Request, res: Response) => {
    res.json(DEPARTMENT_DIRECTORY);
  });

  // Voiceover Text-to-Speech (TTS) endpoint
  app.post('/api/tts', async (req: Request, res: Response) => {
    try {
      const { text, voiceGender } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text is required for TTS' });
      }

      // Format markdown into natural conversational audio
      const cleanSpeech = text
        .replace(/###\s+/g, '')
        .replace(/##\s+/g, '')
        .replace(/#\s+/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\|/g, ' ')
        .replace(/[-*]\s+/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .slice(0, 500);

      const voiceName = voiceGender === 'male' ? 'Puck' : 'Kore';

      if (aiClient && apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        try {
          const response = await aiClient.models.generateContent({
            model: 'gemini-3.8-flash-lite-tts',
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: cleanSpeech,
                    speechMetadata: {
                      style: 'Clear, authoritative, distinguished university academic dean'
                    }
                  }
                ]
              }
            ],
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName }
                }
              }
            }
          });

          const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          if (base64Audio) {
            return res.json({ audioBase64: base64Audio, format: 'wav' });
          }
        } catch (e) {
          console.warn('Gemini TTS unavailable, using native speech synthesis fallback:', e);
        }
      }

      return res.json({ fallback: true, cleanText: cleanSpeech });
    } catch (err) {
      console.error('TTS endpoint error:', err);
      res.json({ fallback: true });
    }
  });

  // Chat message generation endpoint
  app.post('/api/chat', async (req: Request, res: Response) => {
    const startTime = Date.now();
    try {
      const { message, history = [], currentCategory, settings } = req.body;
      const userQuery = String(message || '').trim();

      if (!userQuery) {
        return res.status(400).json({ error: 'Message cannot be empty.' });
      }

      const detectedCategory = classifyCategory(userQuery);
      const category: Category = currentCategory && currentCategory !== 'general' ? currentCategory : detectedCategory;
      const effectiveTone = (settings?.tone as 'balanced' | 'concise' | 'detailed') || 'balanced';
      const forceMode = settings?.mode || 'hybrid';

      // 1. Check local high-precision knowledge base first for widget or factual anchor
      const kbMatch = searchKnowledgeBase(userQuery, category);

      // Determine widget to show
      let widgetType: any = null;
      let widgetData: any = null;
      let sources = kbMatch ? kbMatch.sources : [{ title: 'Metro State Student Affairs Manual', section: 'General Policies' }];
      let suggestedFollowUps = kbMatch ? kbMatch.suggestedFollowUps : [
        'When is the course Add/Drop deadline?',
        'How do I apply for an internship NOC?',
        'How to get a bonafide student certificate?'
      ];

      if (kbMatch?.widgetType) {
        widgetType = kbMatch.widgetType;
        widgetData = kbMatch.widgetData;
      } else if (category === 'deadlines' || userQuery.toLowerCase().includes('deadline') || userQuery.toLowerCase().includes('fee')) {
        widgetType = 'deadline-timer';
        widgetData = { targetDate: '2026-11-05T23:59:59', title: 'Tuition Fee Deadline Closes In' };
      } else if (category === 'certificates' || userQuery.toLowerCase().includes('certificate')) {
        widgetType = 'certificate-stepper';
        widgetData = {
          certificateType: 'Bonafide Certificate',
          processingTime: 'Instant (Digital) / 24h (Physical)',
          fee: '$0',
          status: 'Ready to Request'
        };
      }

      // If user selected Knowledge Base mode only OR no Gemini API key is configured
      const canUseGemini = forceMode !== 'knowledge_base' && aiClient && apiKey && apiKey !== 'MY_GEMINI_API_KEY';

      if (!canUseGemini) {
        // Deterministic high-precision fallback
        let responseText = '';
        if (kbMatch) {
          responseText = formatAnswerWithTone(kbMatch, effectiveTone);
        } else {
          responseText = `### CampusAssist Student Helpdesk

Thank you for your question regarding **${category.toUpperCase()}**.

Here is the general guidance:
- For **Course Registration & Add/Drop**: The official deadline is **October 24, 2026**. Modifying courses after this date requires advisor consultation and results in a Grade W.
- For **Internship NOC**: You can submit your verified corporate offer letter on the **T&P Student Portal** if your CGPA is **>= 6.50**.
- For **Official Certificates (Bonafide, Transcripts)**: Instant digital verification letters can be downloaded via **Student Services > Document Requests** on the ERP.
- For **Semester Deadlines & Fees**: Tuition fee payment without penalty is due **November 5, 2026**.

Would you like more specific details on course prerequisites, fees, or application procedures?`;
        }

        const latencyMs = Date.now() - startTime;
        return res.json({
          text: responseText,
          category,
          sources,
          suggestedFollowUps,
          widgetType,
          widgetData,
          latencyMs,
          modelUsed: 'Knowledge Engine (Verified Rules)'
        });
      }

      // 2. Call Gemini 3.8 Flash with enriched context and tone instruction
      let tonePrompt = '';
      if (effectiveTone === 'concise') {
        tonePrompt = 'Keep the response concise, punchy, and direct (under 120 words). Focus only on key dates, prerequisites, or action steps.';
      } else if (effectiveTone === 'detailed') {
        tonePrompt = 'Provide a thorough, comprehensive response including step-by-step instructions, administrative policies, eligibility criteria, and office contacts.';
      } else {
        tonePrompt = 'Provide a balanced response with clear headers, key bullet points, and actionable links/steps.';
      }

      const customContextPrompt = settings?.customContext ? `\nADDITIONAL CAMPUS ADVISORY NOTE: ${settings.customContext}\n` : '';

      const systemInstruction = `${UNIVERSITY_KNOWLEDGE_CONTEXT}
${customContextPrompt}
TONE SPECIFICATION: ${tonePrompt}
USER QUERY CATEGORY: ${category.toUpperCase()}
`;

      // Construct conversation turns for Gemini
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      // Include recent history if available
      if (Array.isArray(history) && history.length > 0) {
        const recentHistory = history.slice(-4);
        for (const item of recentHistory) {
          if (item.sender === 'user') {
            contents.push({ role: 'user', parts: [{ text: item.text }] });
          } else if (item.sender === 'bot') {
            contents.push({ role: 'model', parts: [{ text: item.text }] });
          }
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: userQuery }]
      });

      if (!aiClient) {
        throw new Error('Google GenAI client is not initialized.');
      }

      const geminiResponse = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.2, // Low temperature for high factual accuracy
        }
      });

      const responseText = geminiResponse.text || (kbMatch ? formatAnswerWithTone(kbMatch, effectiveTone) : 'I am here to help you with course registration, internship NOCs, academic deadlines, and certificates.');
      const latencyMs = Date.now() - startTime;

      return res.json({
        text: responseText,
        category,
        sources,
        suggestedFollowUps,
        widgetType,
        widgetData,
        latencyMs,
        modelUsed: 'gemini-3.8-flash'
      });
    } catch (err: any) {
      console.error('Error generating chat response:', err);
      // Fallback seamlessly to verified knowledge base
      const userQuery = String(req.body?.message || '');
      const category = classifyCategory(userQuery);
      const kbMatch = searchKnowledgeBase(userQuery, category);
      const fallbackText = kbMatch
        ? formatAnswerWithTone(kbMatch, 'balanced')
        : 'The helpdesk is currently operating in offline mode. Please refer to the Student Affairs portal or ask about course add/drop, internship NOC, tuition fees, or bonafide certificates.';

      return res.json({
        text: fallbackText,
        category,
        sources: kbMatch ? kbMatch.sources : [{ title: 'Student Handbook', section: 'General Rules' }],
        suggestedFollowUps: ['When is the Add/Drop deadline?', 'How to get an NOC?'],
        widgetType: kbMatch?.widgetType || null,
        widgetData: kbMatch?.widgetData || null,
        latencyMs: Date.now() - startTime,
        modelUsed: 'Knowledge Engine (Fallback)'
      });
    }
  });

  // Test bench automated execution endpoint
  app.post('/api/test-bench/run-all', async (req: Request, res: Response) => {
    try {
      const { settings } = req.body;
      const results = [];

      for (const item of TEST_BENCH_QUESTIONS) {
        const itemStartTime = Date.now();
        let generatedAnswer = '';
        let latencyMs = 0;

        const kbMatch = searchKnowledgeBase(item.question, item.expectedCategory);

        if (aiClient && apiKey && apiKey !== 'MY_GEMINI_API_KEY' && settings?.mode !== 'knowledge_base') {
          try {
            const geminiResponse = await aiClient.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: [{ role: 'user', parts: [{ text: item.question }] }],
              config: {
                systemInstruction: `${UNIVERSITY_KNOWLEDGE_CONTEXT}\nAnswer concisely and factually for the student test bench evaluation.`,
                temperature: 0.1,
              }
            });
            generatedAnswer = geminiResponse.text || (kbMatch?.detailedAnswer ?? '');
          } catch (e) {
            generatedAnswer = kbMatch?.detailedAnswer ?? 'Automated test response.';
          }
        } else {
          generatedAnswer = kbMatch ? kbMatch.detailedAnswer : 'Automated test response based on student manual.';
        }

        latencyMs = Date.now() - itemStartTime;

        const evalResult = evaluateResponseQuality(
          item.question,
          generatedAnswer,
          item.expectedCategory,
          item.expectedKeywords
        );

        results.push({
          questionId: item.id,
          question: item.question,
          description: item.description,
          expectedCategory: item.expectedCategory,
          actualCategory: evalResult.actualCategory,
          categoryMatch: evalResult.categoryMatch,
          expectedKeywords: item.expectedKeywords,
          matchedKeywords: evalResult.matchedKeywords,
          missingKeywords: evalResult.missingKeywords,
          keywordMatchRate: evalResult.keywordMatchRate,
          score: evalResult.score,
          passed: evalResult.passed,
          feedbackNotes: evalResult.feedbackNotes,
          generatedAnswer,
          latencyMs,
          isEdgeCase: Boolean(item.isEdgeCase)
        });
      }

      const totalScore = results.reduce((sum, r) => sum + r.score, 0);
      const avgScore = Math.round(totalScore / results.length);
      const passedCount = results.filter(r => r.passed).length;
      const passRate = Math.round((passedCount / results.length) * 100);
      const avgLatency = Math.round(results.reduce((sum, r) => sum + r.latencyMs, 0) / results.length);

      res.json({
        totalTests: results.length,
        passedCount,
        passRate,
        avgScore,
        avgLatency,
        results
      });
    } catch (err: any) {
      console.error('Error running test bench:', err);
      res.status(500).json({ error: 'Failed to run test bench suite.' });
    }
  });

  // Mount Vite or static server
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CampusAssist Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
