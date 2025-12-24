import { Router, Request, Response } from 'express';
import { eq, desc, asc, ilike, or, and, count } from 'drizzle-orm';
import { db } from '../db/index.js';
import { quiz, quizAttempt, activeQuizSession } from '../db/schema.js';

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

    // all attempt counts in a single query if user is authenticated
    let attemptCounts: Record<string, number> = {};
    if (req.user?.id) {
      const attempts = await db.query.quizAttempt.findMany({
        where: eq(quizAttempt.userId, req.user.id),
        columns: { quizId: true }
      });

      // count attempts per quiz
      attemptCounts = attempts.reduce((acc, attempt) => {
        acc[attempt.quizId] = (acc[attempt.quizId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
    }

    const result = quizzes.map((q) => ({
      ...q,
      questionCount: q.questions.length,
      questions: q.questions,
      attemptCount: attemptCounts[q.id] || 0,
      maxAttempts: 3
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

    // check if user has an active session and get attempt count
    let activeSession = null;
    let attemptCount = 0;
    const userId = req.user?.id;

    if (userId) {
      activeSession = await db.query.activeQuizSession.findFirst({
        where: and(
          eq(activeQuizSession.quizId, req.params.id),
          eq(activeQuizSession.userId, userId)
        )
      });

      // delete expired session
      if (activeSession && new Date(activeSession.expiresAt) < new Date()) {
        await db
          .delete(activeQuizSession)
          .where(
            and(eq(activeQuizSession.quizId, req.params.id), eq(activeQuizSession.userId, userId))
          );
        activeSession = null;
      }

      // user's attempt count for this quiz
      const attempts = await db.query.quizAttempt.findMany({
        where: and(eq(quizAttempt.quizId, req.params.id), eq(quizAttempt.userId, userId))
      });
      attemptCount = attempts.length;
    }

    const sanitized = quizData.questions.map((q) => ({
      ...q,
      correctAnswer: null,
      explanation: null
    }));
    const { id, startedAt, expiresAt } = activeSession || {};

    return res.json({
      ...quizData,
      questions: sanitized,
      attemptCount,
      maxAttempts: 3,
      activeSession: id
        ? {
            id,
            startedAt,
            expiresAt
          }
        : null
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// submit quiz attempt
router.post('/:id/submit', async (req: Request, res: Response) => {
  try {
    const { answers, startedAt } = req.body;

    if (!startedAt || isNaN(Date.parse(startedAt))) {
      return res.status(400).json({
        error: 'Invalid request body',
        message: 'startedAt must be a valid ISO date string'
      });
    }

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

    // delete active session after submission
    await db
      .delete(activeQuizSession)
      .where(
        and(eq(activeQuizSession.quizId, req.params.id), eq(activeQuizSession.userId, req.user!.id))
      );

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

// start quiz session
router.post('/:id/start', async (req: Request, res: Response) => {
  try {
    const quizData = await db.query.quiz.findFirst({
      where: eq(quiz.id, req.params.id)
    });

    if (!quizData) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // check attempt count (max 3 attempts)
    const attempts = await db.query.quizAttempt.findMany({
      where: and(eq(quizAttempt.quizId, req.params.id), eq(quizAttempt.userId, req.user!.id))
    });

    if (attempts.length >= 3) {
      return res.status(403).json({
        error: 'Maximum attempts reached',
        message: 'You have already taken this quiz 3 times. No more attempts allowed.'
      });
    }

    // check if session already exists
    const existing = await db.query.activeQuizSession.findFirst({
      where: and(
        eq(activeQuizSession.quizId, req.params.id),
        eq(activeQuizSession.userId, req.user!.id)
      )
    });

    if (existing) {
      // delete if expired
      if (new Date(existing.expiresAt) < new Date()) {
        await db
          .delete(activeQuizSession)
          .where(
            and(
              eq(activeQuizSession.quizId, req.params.id),
              eq(activeQuizSession.userId, req.user!.id)
            )
          );
      } else {
        // existing valid session
        return res.json({
          id: existing.id,
          startedAt: existing.startedAt,
          expiresAt: existing.expiresAt,
          serverTime: new Date()
        });
      }
    }

    // create new session
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + quizData.timeLimit! * 60 * 1000);

    const [session] = await db
      .insert(activeQuizSession)
      .values({
        quizId: req.params.id,
        userId: req.user!.id,
        startedAt,
        expiresAt
      })
      .returning();

    return res.json({
      id: session.id,
      startedAt: session.startedAt,
      expiresAt: session.expiresAt,
      serverTime: new Date()
    });
  } catch (error) {
    console.error('Error starting quiz session:', error);
    return res.status(500).json({ error: 'Failed to start quiz session' });
  }
});

// list user attempts
router.get('/attempts/user/:userId', async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.role as string[] | string | null;
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

    const userRole = req.user?.role as string[] | string | null;
    const roles = Array.isArray(userRole) ? userRole : [userRole || ''];
    const isAdmin = roles.includes('admin');

    if (attempt.userId !== req.user!.id && !isAdmin) {
      return res.status(403).json({ error: 'Forbidden - Can only access your own attempts' });
    }

    // attempt count for the quiz
    const attempts = await db.query.quizAttempt.findMany({
      where: and(eq(quizAttempt.quizId, attempt.quizId), eq(quizAttempt.userId, req.user!.id))
    });

    return res.json({
      ...attempt,
      quiz: {
        ...attempt.quiz,
        attemptCount: attempts.length,
        maxAttempts: 3
      }
    });
  } catch (error) {
    console.error('Error fetching attempt:', error);
    return res.status(500).json({ error: 'Failed to fetch attempt' });
  }
});

export default router;
