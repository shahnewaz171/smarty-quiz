import { Router, Request, Response } from 'express';
import { eq, desc, asc, ilike, or, and, count } from 'drizzle-orm';
import { db } from '../db/index.js';
import { quiz, quizAttempt } from '../db/schema.js';

const router = Router();

// list all published quizzes
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, category, difficulty } = req.query;

    const conditions = [];
    if (search && typeof search === 'string') {
      conditions.push(or(ilike(quiz.title, `%${search}%`), ilike(quiz.description, `%${search}%`)));
    }
    if (category && typeof category === 'string') {
      conditions.push(eq(quiz.category, category));
    }
    if (difficulty && typeof difficulty === 'string') {
      conditions.push(eq(quiz.difficulty, difficulty as 'easy' | 'medium' | 'hard'));
    }

    const quizzes = await db.query.quiz.findMany({
      where: and(
        eq(quiz.status, 'published'),
        conditions.length > 0 ? and(...conditions) : undefined
      ),
      with: {
        creator: {
          columns: { id: true, name: true, email: true }
        },
        questions: {
          columns: { id: true, questionText: true, options: true, points: true }
        }
      },
      orderBy: [desc(quiz.createdAt)]
    });

    const filtered_rows = quizzes.length;
    const total_rows = await db
      .select({ count: count() })
      .from(quiz)
      .where(eq(quiz.status, 'published'));

    const result = quizzes.map((q) => ({
      ...q,
      questionCount: q.questions.length,
      questions: undefined
    }));

    return res.json({
      data: result,
      meta_data: { filtered_rows, total_rows: total_rows[0].count }
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// list all quiz categories
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await db.query.quiz.findMany({
      columns: { category: true },
      orderBy: [asc(quiz.category)]
    });

    const categoryList = [...new Set(categories.map((c) => c.category))];

    return res.json(categoryList);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// quiz by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const quizData = await db.query.quiz.findFirst({
      where: eq(quiz.id, req.params.id),
      with: {
        creator: {
          columns: { id: true, name: true, email: true }
        },
        questions: {
          columns: {
            id: true,
            questionText: true,
            options: true,
            points: true,
            order: true,
            explanation: true
          },
          orderBy: (questions, { asc: ascOrder }) => [ascOrder(questions.order)]
        }
      }
    });

    if (!quizData) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const sanitized = quizData.questions.map((q) => ({
      ...q,
      correctAnswer: undefined,
      explanation: undefined
    }));

    return res.json({ ...quizData, questions: sanitized });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// submit quiz attempt
router.post('/:id/submit', async (req: Request, res: Response) => {
  try {
    const { answers, startedAt } = req.body;

    const quizData = await db.query.quiz.findFirst({
      where: eq(quiz.id, req.params.id),
      with: { questions: true }
    });

    if (!quizData) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    let correctCount = 0;
    const totalQuestions = quizData.questions.length;

    answers.forEach((answer: { questionId: string; selectedAnswer: string }) => {
      const questionMatch = quizData.questions.find((q) => q.id === answer.questionId);
      if (questionMatch && questionMatch.correctAnswer === answer.selectedAnswer) {
        correctCount += 1;
      }
    });

    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= quizData.passingScore;

    // Use authenticated user's ID
    const [attempt] = await db
      .insert(quizAttempt)
      .values({
        quizId: req.params.id,
        userId: req.user!.id,
        answers,
        score,
        totalQuestions,
        correctAnswers: correctCount,
        passed,
        startedAt: new Date(startedAt),
        completedAt: new Date()
      })
      .returning();

    const attemptWithDetails = await db.query.quizAttempt.findFirst({
      where: eq(quizAttempt.id, attempt.id),
      with: {
        quiz: {
          with: { questions: true }
        }
      }
    });

    return res.json(attemptWithDetails);
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// list user attempts
router.get('/attempts/user/:userId', async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.role as string[] | string | undefined;
    const roles = Array.isArray(userRole) ? userRole : [userRole || ''];
    const isAdmin = roles.includes('admin');

    if (req.params.userId !== req.user!.id && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden - Can only access your own attempts' });
    }

    const attempts = await db.query.quizAttempt.findMany({
      where: eq(quizAttempt.userId, req.params.userId),
      with: {
        quiz: {
          columns: {
            id: true,
            title: true,
            category: true,
            difficulty: true
          }
        }
      },
      orderBy: [desc(quizAttempt.completedAt)]
    });

    return res.json(attempts);
  } catch (error) {
    console.error('Error fetching attempts:', error);
    return res.status(500).json({ error: 'Failed to fetch attempts' });
  }
});

// specific attempt result
router.get('/attempt/:attemptId', async (req: Request, res: Response) => {
  try {
    const attempt = await db.query.quizAttempt.findFirst({
      where: eq(quizAttempt.id, req.params.attemptId),
      with: {
        quiz: {
          with: { questions: true }
        },
        user: {
          columns: { id: true, name: true, email: true }
        }
      }
    });

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found' });
    }

    const userRole = req.user?.role as string[] | string | undefined;
    const roles = Array.isArray(userRole) ? userRole : [userRole || ''];
    const isAdmin = roles.includes('admin');

    if (attempt.userId !== req.user!.id && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden - Can only access your own attempts' });
    }

    return res.json(attempt);
  } catch (error) {
    console.error('Error fetching attempt:', error);
    return res.status(500).json({ error: 'Failed to fetch attempt' });
  }
});

export default router;
