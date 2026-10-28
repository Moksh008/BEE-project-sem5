import { Request, Response } from 'express';

/**
 * Helper Function: Extracts key academic sentences and keywords from raw notes/syllabus text.
 * Concepts Used:
 * - String Manipulation: `.split()`, `.trim()`, `.replace()`, Regex Lookbehind `(?<=[.!?])`
 * - Array Higher-Order Functions: `.map()`, `.filter()`
 * - ES6 Data Structures: `Set` for stopword filtering & duplicate removal (`Set` -> `Array.from`)
 * 
 * @param text - Raw lecture notes or syllabus input text.
 * @returns Object containing filtered sentences array and unique keywords array.
 */
function extractKeyConcepts(text: string): { sentences: string[]; keywords: string[] } {
  // Split raw text into sentences using punctuation regex
  const rawSentences = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);

  let sentences = rawSentences;
  if (sentences.length < 3) {
    sentences = text
      .split(/[,;\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10);
  }

  if (sentences.length === 0) {
    sentences = [text.trim() || 'Core Academic Principle'];
  }

  // Common English stop words to filter out non-essential vocabulary
  const stopwords = new Set([
    'about', 'above', 'after', 'again', 'against', 'all', 'also', 'and', 'any', 'are', 'because',
    'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'could', 'did',
    'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has',
    'have', 'having', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'into',
    'its', 'itself', 'just', 'more', 'most', 'other', 'our', 'ours', 'shall', 'should', 'some',
    'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there',
    'these', 'they', 'this', 'those', 'through', 'under', 'until', 'very', 'was', 'were',
    'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'your'
  ]);

  // Extract meaningful non-stopword tokens using regular expressions
  const allWords = text
    .replace(/[^\w\s]/gi, '')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopwords.has(w.toLowerCase()));

  // Deduplicate keywords using ES6 Set
  const uniqueKeywords = Array.from(new Set(allWords));

  return { sentences, keywords: uniqueKeywords };
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
    const { notesText, topic = 'General Academic', count = 5, difficulty = 'medium' } = req.body;

    // 2. Input Validation (Guard Clause)
    if (!notesText || typeof notesText !== 'string' || notesText.trim().length === 0) {
      res.status(400).json({ error: 'Please provide notesText (lecture notes, syllabus, or topic text).' });
      return;
    }

    const requestedCount = Math.min(Math.max(Number(count) || 5, 3), 10);
    const apiKey = process.env.GROQ_API_KEY;

    // 3. Groq Cloud AI Generator Integration
    if (apiKey && apiKey.startsWith('gsk_')) {
      const prompt = `
You are an expert academic professor and quiz creator.
Analyze the following lecture notes / syllabus content and generate exactly ${requestedCount} UNIQUE, NON-REPEATING multiple-choice questions for difficulty "${difficulty}".
Ensure each question tests a DIFFERENT concept, definition, or formula mentioned in the text.

Syllabus / Lecture Notes:
"""
${notesText.substring(0, 4000)}
"""

Return ONLY a valid JSON object with a key "questions" containing an array of exactly ${requestedCount} question objects. Do NOT include markdown code fences or extra prose outside the JSON object.
Follow this JSON schema strictly:
{
  "questions": [
    {
      "question": "Clear, concise, unique question statement",
      "correctAnswer": "The correct choice",
      "incorrectAnswers": ["Distinct wrong choice 1", "Distinct wrong choice 2", "Distinct wrong choice 3"],
      "explanation": "Brief 1-sentence academic explanation of why the correct answer is right."
    }
  ]
}
`;

      const groqModels = [
        'llama-3.1-8b-instant',
        'llama3-8b-8192',
        'llama3-70b-8192',
        'mixtral-8x7b-32768'
      ];

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
              temperature: 0.5,
            }),
          });

          if (groqResponse.ok) {
            const groqData = (await groqResponse.json()) as any;
            const content = groqData.choices?.[0]?.message?.content;

            if (content) {
              const parsed = JSON.parse(content);
              const questionsArray = parsed.questions || (Array.isArray(parsed) ? parsed : null);

              if (Array.isArray(questionsArray) && questionsArray.length > 0) {
                console.log(`✅ Groq AI Quiz generated successfully using model: ${modelName}`);
                res.json({
                  source: 'groq-ai',
                  model: modelName,
                  topic,
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

    // 4. --- Enhanced Multi-Concept Fallback Note Parser (Local JS Algorithm) ---
    const { sentences, keywords } = extractKeyConcepts(notesText);

    // Array of higher-order arrow function templates
    const questionTemplates = [
      (concept: string, top: string) => `According to your notes on ${top}, what is the primary principle regarding "${concept}"?`,
      (concept: string, top: string) => `In the context of ${top}, which statement accurately describes "${concept}"?`,
      (concept: string, top: string) => `Regarding "${concept}" in your uploaded notes, which of the following is correct?`,
      (concept: string, top: string) => `What key role or significance does "${concept}" hold in ${top}?`,
      (concept: string, top: string) => `Based on the syllabus text for ${top}, how is "${concept}" defined?`,
    ];

    // Generate non-repeating question objects using Array.from and Modulo Operator (%)
    const generatedQuestions = Array.from({ length: requestedCount }, (_, i) => {
      const currentSentence = sentences[i % sentences.length] || `Core concept ${i + 1} in ${topic}`;

      let concept = keywords[i % keywords.length];
      if (!concept || concept.length < 3) {
        const sentenceWords = currentSentence.split(/\s+/).filter((w) => w.length > 3);
        concept = sentenceWords[i % sentenceWords.length] || `Concept ${i + 1}`;
      }

      const formattedConcept = concept.charAt(0).toUpperCase() + concept.slice(1);
      const templateFn = questionTemplates[i % questionTemplates.length];
      const questionText = templateFn(formattedConcept, topic);

      const correctAnswerText = currentSentence.length > 80
        ? `${currentSentence.substring(0, 75)}...`
        : currentSentence;

      const otherSentences = sentences.filter((_, idx) => idx !== (i % sentences.length));

      let incorrect1 = otherSentences[0]
        ? (otherSentences[0].length > 70 ? `${otherSentences[0].substring(0, 65)}...` : otherSentences[0])
        : `It reverses the phase angle of ${formattedConcept} by 180 degrees without load.`;

      let incorrect2 = otherSentences[1]
        ? (otherSentences[1].length > 70 ? `${otherSentences[1].substring(0, 65)}...` : otherSentences[1])
        : `It reduces overall system efficiency of ${topic} to zero.`;

      let incorrect3 = otherSentences[2]
        ? (otherSentences[2].length > 70 ? `${otherSentences[2].substring(0, 65)}...` : otherSentences[2])
        : `It is unrelated to electrical principles in ${topic}.`;

      if (incorrect1 === correctAnswerText) incorrect1 = `It causes total reactive impedance in ${topic}.`;
      if (incorrect2 === correctAnswerText || incorrect2 === incorrect1) incorrect2 = `It violates conservation of energy in ${formattedConcept}.`;
      if (incorrect3 === correctAnswerText || incorrect3 === incorrect1 || incorrect3 === incorrect2) {
        incorrect3 = `It applies only to DC steady-state circuits.`;
      }

      return {
        question: questionText,
        correctAnswer: correctAnswerText,
        incorrectAnswers: [incorrect1, incorrect2, incorrect3],
        explanation: `Derived from your syllabus note: "${currentSentence}"`,
      };
    });

    // 5. Send JSON Response back to client
    res.json({
      source: 'groq-fallback',
      topic,
      difficulty,
      count: generatedQuestions.length,
      questions: generatedQuestions,
    });
  } catch (error) {
    console.error('Error generating quiz from Groq AI notes:', error);
    res.status(500).json({ error: 'Failed to generate quiz from AI notes.' });
  }
}
