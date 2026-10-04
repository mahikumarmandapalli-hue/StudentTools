import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGenAIClient() {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const ROLE_SYSTEM_INSTRUCTIONS: Record<string, string> = {
  study_mentor:
    'You are the StudentTools AI Study Mentor. Help students plan their study schedules, improve their CGPA/GPA, master Pomodoro focus habits, convert grades accurately, and prepare for university exams. Keep answers structured, encouraging, and practical with clear bullet points.',
  java_tutor:
    'You are a Senior Java & Data Structures Instructor for StudentTools. Explain Java concepts (OOPs, JVM, Collections, Multithreading, Exception Handling, Streams, JDBC, and SQL) with clean, well-commented code examples, time/space complexity analysis, and common fresher pitfalls.',
  interview_coach:
    'You are a Technical & HR Mock Interviewer for freshers and college students. Ask realistic interview questions, evaluate the student\'s response using the STAR method or technical accuracy, provide a constructive score out of 10, and show a model sample answer.',
  resume_reviewer:
    'You are an Expert ATS Resume & Career Coach for students and freshers. Help students craft high-impact project descriptions, quantify achievements, select the right technical skill keywords, and understand CTC vs In-Hand salary breakdowns.',
};

async function callWithModelFallback<T>(
  primaryModel: string,
  fallbackModels: string[],
  fn: (model: string) => Promise<T>
): Promise<{ result: T; modelUsed: string }> {
  const modelsToTry = [primaryModel, ...fallbackModels.filter((m) => m !== primaryModel)];
  let lastError: unknown = null;

  for (const model of modelsToTry) {
    try {
      const result = await fn(model);
      return { result, modelUsed: model };
    } catch (err: unknown) {
      lastError = err;
      const isRecoverable = isQuotaError(err) || (() => {
        const msg = err instanceof Error ? err.message : String(err);
        return (
          msg.includes('404') ||
          msg.includes('NOT_FOUND') ||
          msg.includes('not found') ||
          msg.includes('is not supported') ||
          msg.includes('503') ||
          msg.includes('UNAVAILABLE') ||
          msg.includes('overloaded')
        );
      })();

      if (!isRecoverable) {
        throw err;
      }
      console.info(`[Model Fallback] ${model} unavailable or rate-limited. Trying next fallback...`);
    }
  }
  throw lastError;
}

function isQuotaError(err: unknown): boolean {
  if (!err) return false;
  const msg = err instanceof Error ? err.message : String(err);
  let str = '';
  try {
    str = typeof err === 'object' ? JSON.stringify(err) : '';
  } catch {
    str = '';
  }
  const combined = (msg + ' ' + str).toLowerCase();
  return (
    combined.includes('429') ||
    combined.includes('resource_exhausted') ||
    combined.includes('quota') ||
    combined.includes('rate-limit') ||
    combined.includes('rate limit') ||
    combined.includes('exceeded your current quota')
  );
}

function generateAcademicOfflineResponse(rolePersona: string, query: string): string {
  const q = query.toLowerCase();

  if (q.includes('java') || q.includes('oop') || q.includes('jvm') || q.includes('multithreading') || q.includes('collection')) {
    return `### ☕ Java & OOP Academic Guide\n\n` +
      `Here is key guidance for your question regarding **Java & Object-Oriented Programming**:\n\n` +
      `1. **Core Concept Overview**: Java is a strongly typed, class-based, object-oriented language running on the JVM (*"Write Once, Run Anywhere"*). Memory is partitioned into the **Stack** (primitive variables and method call frames) and the **Heap** (all objects and instances).\n\n` +
      `2. **The 4 Pillars of OOP**:\n` +
      `   - **Encapsulation**: Bundling fields with public getters/setters and private access modifiers.\n` +
      `   - **Inheritance**: Code reuse via \`extends\` (\`super()\` calls the parent constructor).\n` +
      `   - **Polymorphism**: Compile-time (Method Overloading) vs Runtime (Method Overriding with \`@Override\`).\n` +
      `   - **Abstraction**: Hiding implementation details via \`abstract class\` and \`interface\`.\n\n` +
      `3. **Key Best Practices**:\n` +
      `   - Use \`StringBuilder\` instead of repeatedly concatenating immutable \`String\` in loops.\n` +
      `   - Always override \`hashCode()\` whenever you override \`equals()\` to keep HashMaps consistent.\n` +
      `   - Prefer \`ArrayList\` for fast indexed lookups ($O(1)$) and \`HashMap\` for key-value pairs.\n\n` +
      `💡 *You can also explore all 41 full-length Java modules directly in the StudentTools **Java** section above!*\n\n` +
      `*(⚡ Note: Live Gemini API quota is temporarily rate-limited; this response was synthesized via StudentTools Built-In Academic Knowledge Engine.)*`;
  }

  if (q.includes('python') || q.includes('list') || q.includes('tuple') || q.includes('dict') || q.includes('decorator')) {
    return `### 🐍 Python Programming Guide\n\n` +
      `Here is helpful guidance for your Python query:\n\n` +
      `1. **Core Characteristics**: Python is an interpreted, dynamically typed language emphasizing readability and clean syntax.\n\n` +
      `2. **Crucial Distinctions**:\n` +
      `   - **Lists vs Tuples**: Lists \`[...]\` are mutable ($O(1)$ amortized append); Tuples \`(...)\` are immutable and hashable (usable as dictionary keys).\n` +
      `   - **List Comprehensions**: Elegant syntax for mapping & filtering: \`[x * 2 for x in nums if x > 0]\`.\n` +
      `   - **\`*args\` and \`**kwargs\`**: Allow functions to accept variable numbers of positional or keyword arguments.\n\n` +
      `3. **Memory & Performance**:\n` +
      `   - Python uses reference counting combined with a cyclic garbage collector.\n` +
      `   - For large datasets, use **Generators** (\`yield\`) to stream items with $O(1)$ memory rather than instantiating huge lists.\n\n` +
      `💡 *Check the StudentTools **Python** track above for 35 guided modules with runnable examples!*\n\n` +
      `*(⚡ Note: Live Gemini API quota is temporarily rate-limited; this response was synthesized via StudentTools Built-In Academic Knowledge Engine.)*`;
  }

  if (q.includes('interview') || q.includes('fresher') || q.includes('star method') || q.includes('hiring')) {
    return `### 🎯 Technical & HR Interview Strategy\n\n` +
      `Here is high-impact interview preparation guidance:\n\n` +
      `1. **Master the STAR Method for Behavioral Questions**:\n` +
      `   - **S (Situation)**: Set the context briefly (university project, hackathon, internship).\n` +
      `   - **T (Task)**: Clarify your specific responsibility.\n` +
      `   - **A (Action)**: Explain the tools and engineering steps **you** personally took.\n` +
      `   - **R (Result)**: Quantify the outcome (e.g., *"reduced loading time by 35%", "graded 9.5/10"*).\n\n` +
      `2. **Core Technical Checklist for Freshers**:\n` +
      `   - Basic Data Structures: Arrays, Strings, HashMaps, Linked Lists, Binary Trees.\n` +
      `   - Time & Space Complexity ($O(1)$, $O(\\log n)$, $O(n)$, $O(n^2)$).\n` +
      `   - Database fundamentals: Primary/Foreign Keys, Normalization, and standard SQL \`JOIN\`s.\n\n` +
      `💡 *Explore the **Interview** and **Coding Practice** tabs in StudentTools for interactive questions & coding challenges!*\n\n` +
      `*(⚡ Note: Live Gemini API quota is temporarily rate-limited; this response was synthesized via StudentTools Built-In Academic Knowledge Engine.)*`;
  }

  if (q.includes('resume') || q.includes('ats') || q.includes('cv') || q.includes('format')) {
    return `### 📄 Resume & ATS Optimization Checklist\n\n` +
      `To ensure your student resume passes Applicant Tracking Systems (ATS) and impresses recruiters:\n\n` +
      `1. **Standard Section Layout**: Personal Info → Career Objective → Technical Skills → Projects → Education → Certifications & Achievements.\n` +
      `2. **The Google XYZ Formula for Projects**: *"Accomplished [X], as measured by [Y], by doing [Z]"*.\n` +
      `   - *Before*: "Built an attendance tracker website."\n` +
      `   - *After*: "Engineered a responsive student attendance tracker with automated threshold alerts, reducing shortage risks by 40%."\n` +
      `3. **Key Technical Keywords**: Group skills cleanly by categories (Languages, Frameworks, Databases, Tools).\n\n` +
      `💡 *Use the built-in **Resume Builder** on this portal to format, preview, and download your clean PDF/JSON resume!*\n\n` +
      `*(⚡ Note: Live Gemini API quota is temporarily rate-limited; this response was synthesized via StudentTools Built-In Academic Knowledge Engine.)*`;
  }

  if (q.includes('cgpa') || q.includes('gpa') || q.includes('percentage') || q.includes('marks')) {
    return `### 🧮 Grade & Scale Calculation Insights\n\n` +
      `Here is the standard academic formula guide:\n\n` +
      `1. **CBSE / Standard University**: $\\text{Percentage (\\%)} = \\text{CGPA} \\times 9.5$.\n` +
      `2. **Direct Scale**: $\\text{Percentage (\\%)} = \\text{CGPA} \\times 10.0$.\n` +
      `3. **US 4.0 Scale Conversion**: $\\text{GPA (4.0)} \\approx (\\text{CGPA} / 10.0) \\times 4.0$.\n` +
      `4. **Subject-Wise Weighted SGPA**: $\\text{SGPA} = \\frac{\\sum (\\text{Grade Points} \\times \\text{Credits})}{\\sum \\text{Credits}}$.\n\n` +
      `💡 *Use our interactive **Scale & Grade Converter** or **CGPA Calculator** in the Tools section for instant calculations!*\n\n` +
      `*(⚡ Note: Live Gemini API quota is temporarily rate-limited; this response was synthesized via StudentTools Built-In Academic Knowledge Engine.)*`;
  }

  return `### 🎓 StudentTools Study Assistant\n\n` +
    `Thank you for your question! Here are key recommendations:\n\n` +
    `• **Structured Study**: Break tasks into 25-minute Pomodoro focus sprints with 5-minute restorative breaks.\n` +
    `• **Active Recall & Spaced Repetition**: Instead of passively re-reading notes, practice writing code examples and answering interview Q&A.\n` +
    `• **StudentTools Resources**: You have immediate access to 41 Java topics, 35 Python lessons, 11 student tools, and coding practice problems on this platform.\n\n` +
    `*(⚡ Note: Live Gemini API quota is temporarily rate-limited; this response was synthesized via StudentTools Built-In Academic Knowledge Engine. Live AI will resume once quota resets.)*`;
}

function extractGroundingSources(response: GenerateContentResponse) {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources: { title: string; uri: string }[] = [];
  const seen = new Set<string>();

  for (const chunk of chunks) {
    const uri = chunk.web?.uri;
    const title = chunk.web?.title || uri || 'Web Source';
    if (uri && !seen.has(uri)) {
      seen.add(uri);
      sources.push({ title, uri });
    }
  }
  return sources;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));

  // 1. Multi-turn Gemini Chatbot Endpoint
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const {
        messages = [],
        rolePersona = 'study_mentor',
        modelTier = 'flash',
        useSearchGrounding = false,
      } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: 'Messages array is required.' });
        return;
      }

      const ai = getGenAIClient();
      const systemInstruction =
        ROLE_SYSTEM_INSTRUCTIONS[rolePersona] || ROLE_SYSTEM_INSTRUCTIONS.study_mentor;

      // Select model based on user's requested task complexity
      // - 'pro': gemini-3.1-pro-preview
      // - 'flash': gemini-3.8-flash (with fallbacks to gemini-3.1-flash-lite / gemini-flash-latest)
      // - 'lite': gemini-3.1-flash-lite (fastest, high quota)
      let primaryModel = 'gemini-3.8-flash';
      let fallbacks = ['gemini-3.1-flash-lite', 'gemini-flash-latest'];

      if (modelTier === 'pro') {
        primaryModel = 'gemini-3.1-pro-preview';
        fallbacks = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
      } else if (modelTier === 'lite') {
        primaryModel = 'gemini-3.1-flash-lite';
        fallbacks = ['gemini-3.8-flash', 'gemini-flash-latest'];
      }

      // Build chat history for ai.chats.create
      const previousMessages = messages.slice(0, -1);
      const latestMessage = messages[messages.length - 1]?.text || '';

      const history = previousMessages.map((m: { role: string; text: string }) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: String(m.text || '') }],
      }));

      const { result: response, modelUsed } = await callWithModelFallback(
        primaryModel,
        fallbacks,
        async (modelName) => {
          const chat = ai.chats.create({
            model: modelName,
            history,
            config: {
              systemInstruction,
              ...(useSearchGrounding ? { tools: [{ googleSearch: {} }] } : {}),
            },
          });
          return await chat.sendMessage({
            message: latestMessage,
          });
        }
      );

      const text = response.text || 'I could not generate a response. Please try again.';
      const sources = extractGroundingSources(response);

      res.json({
        text,
        sources,
        modelUsed,
      });
    } catch (error: unknown) {
      if (isQuotaError(error)) {
        console.info('[Chat Notice] Quota limit reached for Gemini chat. Serving academic offline response.');
        const fallbackText = generateAcademicOfflineResponse(
          req.body.rolePersona || 'study_mentor',
          req.body.messages?.[req.body.messages.length - 1]?.text || ''
        );
        res.json({
          text: fallbackText,
          sources: [],
          modelUsed: 'StudentTools Academic Knowledge Base (Instant Fallback)',
          quotaExceeded: true,
        });
        return;
      }
      console.error('Unexpected error in /api/gemini/chat:', error instanceof Error ? error.message : error);
      const message = error instanceof Error ? error.message : 'Failed to generate chat response';
      res.status(500).json({ error: message });
    }
  });

  // 2. Audio Transcription Endpoint (gemini-3.5-transcribe)
  app.post('/api/gemini/transcribe', async (req, res) => {
    try {
      const { audioBase64, mimeType = 'audio/webm', prompt } = req.body;
      if (!audioBase64 || typeof audioBase64 !== 'string') {
        res.status(400).json({ error: 'audioBase64 is required for transcription.' });
        return;
      }

      const ai = getGenAIClient();
      const audioPart = {
        inlineData: {
          mimeType,
          data: audioBase64,
        },
      };
      const textPart = {
        text:
          prompt ||
          'Transcribe this audio accurately. Return only the clean transcribed text without extra commentary.',
      };

      const { result: response, modelUsed } = await callWithModelFallback(
        'gemini-3.5-transcribe',
        ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'],
        async (modelName) => {
          return await ai.models.generateContent({
            model: modelName,
            contents: { parts: [audioPart, textPart] },
          });
        }
      );

      res.json({
        text: (response.text || '').trim(),
        modelUsed,
      });
    } catch (error: unknown) {
      if (isQuotaError(error)) {
        console.info('[Transcribe Notice] Quota reached for Gemini transcribe.');
        res.status(429).json({
          error:
            'Gemini audio transcription quota is temporarily rate-limited. Please wait a few moments and try speaking again, or type your notes directly.',
        });
        return;
      }
      console.error('Unexpected error in /api/gemini/transcribe:', error instanceof Error ? error.message : error);
      const message = error instanceof Error ? error.message : 'Failed to transcribe audio';
      res.status(500).json({ error: message });
    }
  });

  // 3. Google Search Grounded Query Endpoint (gemini-3.8-flash with googleSearch & un-grounded fallback)
  app.post('/api/gemini/search', async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'Search query is required.' });
        return;
      }

      const ai = getGenAIClient();
      let searchResponse: any = null;
      let modelUsed = 'gemini-3.8-flash';

      // Attempt 1: Grounded search
      try {
        const groundedRes = await callWithModelFallback(
          'gemini-3.8-flash',
          ['gemini-3.1-flash-lite', 'gemini-flash-latest'],
          async (modelName) => {
            return await ai.models.generateContent({
              model: modelName,
              contents: query,
              config: {
                systemInstruction:
                  'You are a real-time academic, career, and tech research assistant for students. Use Google Search to provide accurate, up-to-date answers with clear facts, dates, and actionable takeaways.',
                tools: [{ googleSearch: {} }],
              },
            });
          }
        );
        searchResponse = groundedRes.result;
        modelUsed = groundedRes.modelUsed;
      } catch (groundedErr) {
        if (isQuotaError(groundedErr)) {
          // Attempt 2: Standard generation without search tool (often has separate/available quota)
          try {
            const standardRes = await callWithModelFallback(
              'gemini-3.8-flash',
              ['gemini-3.1-flash-lite', 'gemini-flash-latest'],
              async (modelName) => {
                return await ai.models.generateContent({
                  model: modelName,
                  contents: query,
                  config: {
                    systemInstruction:
                      'You are an academic, career, and tech research advisor for students. Provide structured, accurate, and comprehensive answers with key takeaways.',
                  },
                });
              }
            );
            searchResponse = standardRes.result;
            modelUsed = standardRes.modelUsed + ' (un-grounded)';
          } catch {
            // Will drop to offline fallback
          }
        }
      }

      if (searchResponse && searchResponse.text) {
        const text = searchResponse.text;
        const sources = extractGroundingSources(searchResponse);
        res.json({
          text,
          sources,
          modelUsed,
        });
        return;
      }

      // Attempt 3: Offline Academic Knowledge Engine
      console.info(`[Search Notice] Serving academic offline response for query: "${query.slice(0, 40)}"`);
      const fallbackText = generateAcademicOfflineResponse('study_mentor', query);
      res.json({
        text: fallbackText,
        sources: [],
        modelUsed: 'StudentTools Academic Knowledge Base (Instant Fallback)',
        quotaExceeded: true,
      });
    } catch (error: unknown) {
      if (isQuotaError(error)) {
        console.info('[Search Notice] Quota reached for Gemini search. Serving academic offline response.');
        const fallbackText = generateAcademicOfflineResponse('study_mentor', req.body.query || '');
        res.json({
          text: fallbackText,
          sources: [],
          modelUsed: 'StudentTools Academic Knowledge Base (Instant Fallback)',
          quotaExceeded: true,
        });
        return;
      }
      console.error('Unexpected error in /api/gemini/search:', error instanceof Error ? error.message : error);
      const message = error instanceof Error ? error.message : 'Failed to perform search';
      res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StudentTools server running on http://localhost:${PORT}`);
  });
}

startServer();
