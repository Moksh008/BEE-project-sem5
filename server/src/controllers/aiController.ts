import { Request, Response } from 'express';
import { saveGeneratedQuestions } from '../config/seed.js';

/**
 * Helper Function: Removes markdown code fences some models wrap around JSON.
 */
function stripCodeFences(text: string): string {
  return text.replace(/^\s*```(?:json)?/i, '').replace(/```\s*$/, '').trim();
}

/**
 * Helper Function: Validates and normalises the question objects returned by the LLM.
 * Drops malformed entries and duplicate questions so a quiz never repeats itself.
 */
function sanitizeQuestions(raw: unknown, count: number): any[] {
  if (!Array.isArray(raw)) return [];

  const seen = new Set<string>();
  const cleaned: any[] = [];

  for (const item of raw) {
    const question = typeof item?.question === 'string' ? item.question.trim() : '';
    const correctAnswer = typeof item?.correctAnswer === 'string' ? item.correctAnswer.trim() : '';
    const distractors = Array.isArray(item?.incorrectAnswers)
      ? Array.from(
          new Set(
            item.incorrectAnswers
              .filter((a: unknown): a is string => typeof a === 'string')
              .map((a: string) => a.trim())
              .filter((a: string) => a.length > 0 && a.toLowerCase() !== correctAnswer.toLowerCase())
          )
        )
      : [];

    if (!question || !correctAnswer || distractors.length < 2) continue;

    const key = question.toLowerCase().replace(/\s+/g, ' ');
    if (seen.has(key)) continue;
    seen.add(key);

    cleaned.push({
      question,
      correctAnswer,
      incorrectAnswers: distractors.slice(0, 3),
      explanation:
        typeof item?.explanation === 'string' && item.explanation.trim().length > 0
          ? item.explanation.trim()
          : undefined,
    });

    if (cleaned.length >= count) break;
  }

  return cleaned;
}

/**
 * Controller Endpoint Function: Generates interactive multiple-choice questions from lecture notes.
 * Concepts Used:
 * - Express Request/Response Handling (`req: Request`, `res: Response`)
 * - Object Destructuring (`const { notesText, topic, count } = req.body`)
 * - Asynchronous Operations (`async/await`, Promises, `fetch`)
 * - Groq Cloud AI Integration (Llama 3.1 8B Instant)
 * - Array Generation & Fallback Algorithms
 * 
 * @route POST /api/ai/generate-quiz
 */
export async function generateQuizFromNotes(req: Request, res: Response): Promise<void> {
  try {
    // 1. Destructure user parameters from HTTP request body
    const { notesText, topic = 'General Academic', count = 5, difficulty = 'medium', topicOnly = false } = req.body;

    const safeNotes = typeof notesText === 'string' ? notesText.trim() : '';
    const safeTopic = typeof topic === 'string' ? topic.trim() : '';

    // 2. Input Validation (Guard Clause) — a topic-only request is valid when the player typed a subject.
    if (!safeNotes && !(topicOnly && safeTopic)) {
      res.status(400).json({ error: 'Please provide notesText (lecture notes, syllabus, or topic text).' });
      return;
    }

    const maxCount = topicOnly ? 20 : 10;
    const requestedCount = Math.min(Math.max(Number(count) || 5, 3), maxCount);
    const apiKey = process.env.GROQ_API_KEY;

    // Custom topics live in their own `topic/<name>` bucket, matching the client's lookup key.
    // Notes-based sets get a `notes/...` bucket so they never leak into an unrelated quiz bank
    // such as `general`, `bee` or `cs`.
    const saveCategory = topicOnly
      ? `topic/${safeTopic.toLowerCase()}`
      : `notes/${(safeTopic || 'syllabus').toLowerCase().slice(0, 40)}`;

    // 3. Groq Cloud AI Generator Integration
    if (apiKey && apiKey.startsWith('gsk_')) {
      // Notes-based requests must be answered from the pasted text only.
      // Topic-only requests have no material, so they test standard coursework on the subject.
      const notesPrompt = `
You are an exam writer creating a multiple-choice quiz for a student.

The student's course topic label is: "${safeTopic || 'Academic Notes'}".

The ONLY source of truth is the study material below. Read it carefully and write questions from it.

STUDY MATERIAL:
"""
${safeNotes.substring(0, 6000)}
"""

HARD RULES:
1. Every question must be answerable directly and only from the STUDY MATERIAL above.
2. Use the exact terms, definitions, concepts, APIs, formulas and examples that appear in that material.
3. If something is not in the material, do not ask about it. No outside facts, no other subjects.
4. Write exactly ${requestedCount} UNIQUE questions, each testing a DIFFERENT concept from a different part of the material.
5. Difficulty: "${difficulty}". Each question needs one correct answer and three plausible but clearly wrong distractors, all four similar in length and format.
6. Do not number or prefix the questions, and do not repeat a question.

Return ONLY a valid JSON object, no markdown fences and no prose, in exactly this schema:
{
  "questions": [
    {
      "question": "Clear question statement drawn from the study material",
      "correctAnswer": "The correct choice",
      "incorrectAnswers": ["Distinct wrong choice 1", "Distinct wrong choice 2", "Distinct wrong choice 3"],
      "explanation": "One sentence, quoting the exact part of the study material that supports the answer."
    }
  ]
}
`;

      const topicPrompt = `
You are an exam writer creating a multiple-choice quiz.
The subject is exactly: "${safeTopic}".

HARD RULES:
1. Every question must test core concepts, definitions, formulas or applications of "${safeTopic}" only, answerable from standard coursework on that subject.
2. Never write a question about a different subject.
3. Write exactly ${requestedCount} UNIQUE questions, each testing a DIFFERENT concept.
4. Difficulty: "${difficulty}". Each question needs one correct answer and three plausible but clearly wrong distractors.
5. Do not number or prefix the questions, and do not repeat a question.

Return ONLY a valid JSON object, no markdown fences and no prose, in exactly this schema:
{
  "questions": [
    {
      "question": "Clear question statement",
      "correctAnswer": "The correct choice",
      "incorrectAnswers": ["Distinct wrong choice 1", "Distinct wrong choice 2", "Distinct wrong choice 3"],
      "explanation": "One sentence explaining why the correct answer is right."
    }
  ]
}
`;

      const prompt = safeNotes ? notesPrompt : topicPrompt;

      // GROQ_MODEL in .env lets the project pin whichever model the key owns.
      const pinnedModel = (process.env.GROQ_MODEL || '').trim();
      const supportedModels = [
        'openai/gpt-oss-120b',
        'openai/gpt-oss-20b',
        'qwen/qwen3.8-27b',
        'allam-2-7b'
      ];
      const groqModels = pinnedModel
        ? [pinnedModel, ...supportedModels.filter((m) => m !== pinnedModel)]
        : supportedModels;

      // Iterative loop over supported Groq LLM model names (Loop + Async/Await)
      for (const modelName of groqModels) {
        try {
          const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: modelName,
              messages: [
                {
                  role: 'system',
                  content: 'You are a JSON-only API that outputs structured multiple-choice quiz questions based on academic notes.',
                },
                {
                  role: 'user',
                  content: prompt,
                },
              ],
              response_format: { type: 'json_object' },
              // Low temperature keeps the answers faithful to the pasted material.
              temperature: safeNotes ? 0.2 : 0.5,
            }),
          });

          if (groqResponse.ok) {
            const groqData = (await groqResponse.json()) as any;
            const content = groqData.choices?.[0]?.message?.content;

            if (content) {
              const parsed = JSON.parse(stripCodeFences(content));
              const rawQuestions = parsed.questions || (Array.isArray(parsed) ? parsed : null);
              const questionsArray = sanitizeQuestions(rawQuestions, requestedCount);

              if (questionsArray.length > 0) {
                console.log(`✅ Groq AI Quiz generated successfully using model: ${modelName}`);
                // Persist the AI question set into MongoDB (fire-and-forget)
                void saveGeneratedQuestions(questionsArray, saveCategory, difficulty, 'ai');
                res.json({
                  source: 'groq-ai',
                  model: modelName,
                  topic: safeTopic,
                  difficulty,
                  count: questionsArray.length,
                  questions: questionsArray,
                });
                return;
              }
            }
          } else {
            const errText = await groqResponse.text();
            console.warn(`Groq API model ${modelName} warning:`, errText);
          }
        } catch (groqErr) {
          console.warn(`Groq API exception for ${modelName}:`, groqErr);
        }
      }
    }

    // 4. Every remaining path means the LLM produced nothing usable. Report that clearly
    // instead of returning invented questions that do not match the student's notes.
    res.status(503).json({
      source: 'unavailable',
      error: safeNotes
        ? 'The AI could not build a quiz from these notes right now. Please try again in a moment.'
        : 'AI question generation is unavailable right now.',
    });
  } catch (error) {
    console.error('Error generating quiz from Groq AI notes:', error);
    res.status(500).json({ error: 'Failed to generate quiz from AI notes.' });
  }
}
