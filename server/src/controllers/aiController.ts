import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateQuizFromNotes(req: Request, res: Response): Promise<void> {
  try {
    const { notesText, topic = 'General Academic', count = 5, difficulty = 'medium' } = req.body;

    if (!notesText || typeof notesText !== 'string' || notesText.trim().length === 0) {
      res.status(400).json({ error: 'Please provide notesText (lecture notes, syllabus, or topic text).' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
You are an expert academic professor and quiz creator.
Analyze the following lecture notes / syllabus content and generate exactly ${count} multiple-choice questions for difficulty "${difficulty}".

Syllabus / Lecture Notes:
"""
${notesText.substring(0, 3000)}
"""

Return ONLY a valid JSON array containing exactly ${count} objects. Do NOT include markdown code fences or extra prose.
Each object MUST strictly follow this JSON schema:
[
  {
    "question": "Clear, concise question statement",
    "correctAnswer": "The correct choice",
    "incorrectAnswers": ["Wrong choice 1", "Wrong choice 2", "Wrong choice 3"],
    "explanation": "Brief 1-sentence academic explanation of why the correct answer is right."
  }
]
`;

        const result = await model.generateContent(prompt);
        const textResponse = result.response.text();

        // Clean any code block wrappers
        const cleanedJsonText = textResponse
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim();

        const parsedQuestions = JSON.parse(cleanedJsonText);

        res.json({
          source: 'gemini-ai',
          topic,
          difficulty,
          count: parsedQuestions.length,
          questions: parsedQuestions,
        });
        return;
      } catch (geminiError) {
        console.error('Gemini API Error, falling back to Intelligent Note Parser:', geminiError);
      }
    }

    // Intelligent Note Parser Fallback (When GEMINI_API_KEY is not set)
    const sentences = notesText
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 15);

    const generatedQuestions = Array.from({ length: Math.min(count, 5) }, (_, i) => {
      const baseSentence = sentences[i % sentences.length] || `Key concept in ${topic}`;
      const words = baseSentence.split(' ');
      const keyWord = words.find((w) => w.length > 4) || 'Principle';

      return {
        question: `Based on your notes: What is the primary significance of "${keyWord}" in ${topic}?`,
        correctAnswer: baseSentence.length > 60 ? `${baseSentence.substring(0, 50)}...` : baseSentence,
        incorrectAnswers: [
          `It is irrelevant to ${topic}`,
          `It causes phase inversion without load`,
          `It reduces system efficiency to zero`,
        ],
        explanation: `Derived directly from your uploaded syllabus note: "${baseSentence}"`,
      };
    });

    res.json({
      source: 'ai-note-parser',
      topic,
      difficulty,
      count: generatedQuestions.length,
      questions: generatedQuestions,
      note: apiKey ? 'Fallback parser used' : 'Set GEMINI_API_KEY in server/.env for live Google Gemini AI generation.',
    });
  } catch (error) {
    console.error('Error generating quiz from AI:', error);
    res.status(500).json({ error: 'Failed to generate quiz from AI notes.' });
  }
}
