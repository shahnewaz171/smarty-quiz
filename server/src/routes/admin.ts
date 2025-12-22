import { Router, Request, Response } from 'express';
import { eq, desc, count, gte, or, and, ilike } from 'drizzle-orm';
import { db } from '../db/index.js';
import { quiz, question, quizAttempt, users } from '../db/schema.js';

interface QuestionInput {
  id?: string;
  questionText: string;
  options: unknown;
  correctAnswer: string;
  explanation?: string;
  points?: number;
}

const router = Router();

//dashboard statistics
router.get('/statistics', async (req: Request, res: Response) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsersResult,
      totalQuizzesResult,
      totalAttemptsResult,
      publishedQuizzesResult,
      unpublishedQuizzes
    ] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(quiz),
      db.select({ count: count() }).from(quizAttempt),
      db.select({ count: count() }).from(quiz).where(eq(quiz.status, 'published')),
      db
        .select({ count: count() })
        .from(quiz)
        .where(or(eq(quiz.status, 'draft'), eq(quiz.status, 'unpublished')))
    ]);

    // active users in last 30 days
    const activeUsersResult = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.lastLoginAt, thirtyDaysAgo));

    // recent quiz attempts
    const recentAttempts = await db.query.quizAttempt.findMany({
      limit: 10,
      orderBy: [desc(quizAttempt.completedAt)],
      with: {
        user: { columns: { id: true, name: true, email: true } },
        quiz: { columns: { id: true, title: true } }
      }
    });

    // average score across all completed attempts
    const completedAttempts = await db.select({ score: quizAttempt.score }).from(quizAttempt);

    const averageScore =
      completedAttempts.length > 0
        ? completedAttempts.reduce((sum, a) => sum + a.score, 0) / completedAttempts.length
        : 0;

    return res.json({
      totalUsers: totalUsersResult[0].count,
      activeUsers: activeUsersResult[0].count,
      totalQuizzes: totalQuizzesResult[0].count,
      publishedQuizzes: publishedQuizzesResult[0].count,
      unpublishedQuizzes: unpublishedQuizzes[0].count,
      totalAttempts: totalAttemptsResult[0].count,
      averageScore: Math.round(averageScore * 100) / 100,
      recentAttempts: recentAttempts.length
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// user statistics
router.get('/statistics/users', async (req: Request, res: Response) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [totalUsersResult, activeUsersResult, newUsersResult, allUsers] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(users).where(gte(users.lastLoginAt, thirtyDaysAgo)),
      db.select({ count: count() }).from(users).where(gte(users.createdAt, startOfMonth)),
      db.select({ role: users.role }).from(users)
    ]);

    // count users by role
    const usersByRole = allUsers.reduce(
      (acc, user) => {
        if (user.role.includes('admin')) acc.admin += 1;
        if (user.role.includes('user')) acc.user += 1;
        return acc;
      },
      { admin: 0, user: 0 }
    );

    return res.json({
      totalUsers: totalUsersResult[0].count,
      activeUsers: activeUsersResult[0].count,
      newUsersThisMonth: newUsersResult[0].count,
      usersByRole
    });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    return res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

// quiz statistics
router.get('/statistics/quizzes', async (req: Request, res: Response) => {
  try {
    const [
      totalQuizzesResult,
      publishedQuizzesResult,
      unpublishedQuizzesResult,
      allQuizzes,
      quizAttempts
    ] = await Promise.all([
      db.select({ count: count() }).from(quiz),
      db.select({ count: count() }).from(quiz).where(eq(quiz.status, 'published')),
      db
        .select({ count: count() })
        .from(quiz)
        .where(or(eq(quiz.status, 'draft'), eq(quiz.status, 'unpublished'))),
      db.select({ category: quiz.category, difficulty: quiz.difficulty }).from(quiz),
      db.query.quizAttempt.findMany({
        columns: { quizId: true },
        with: { quiz: { columns: { id: true, title: true } } }
      })
    ]);

    // count quizzes by category
    const quizzesByCategory = allQuizzes.reduce((acc, q) => {
      acc[q.category] = (acc[q.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // count quizzes by difficulty
    const quizzesByDifficulty = allQuizzes.reduce(
      (acc, q) => {
        acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
        return acc;
      },
      { easy: 0, medium: 0, hard: 0 }
    );

    // calculate average attempts per quiz
    const attemptsPerQuiz = quizAttempts.reduce((acc, attempt) => {
      acc[attempt.quizId] = (acc[attempt.quizId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageAttemptsPerQuiz =
      totalQuizzesResult[0].count > 0
        ? Object.values(attemptsPerQuiz).reduce((sum, attemptCount) => sum + attemptCount, 0) /
          totalQuizzesResult[0].count
        : 0;

    // most popular quizzes
    const mostPopularQuizzes = Object.entries(attemptsPerQuiz)
      .map(([quizId, attempts]) => {
        const attempt = quizAttempts.find((a) => a.quizId === quizId);
        return {
          id: quizId,
          title: attempt?.quiz.title || 'Unknown',
          attempts
        };
      })
      .sort((a, b) => b.attempts - a.attempts)
      .slice(0, 5);

    return res.json({
      totalQuizzes: totalQuizzesResult[0].count,
      publishedQuizzes: publishedQuizzesResult[0].count,
      unpublishedQuizzes: unpublishedQuizzesResult[0].count,
      quizzesByCategory,
      quizzesByDifficulty,
      averageAttemptsPerQuiz: Math.round(averageAttemptsPerQuiz * 100) / 100,
      mostPopularQuizzes
    });
  } catch (error) {
    console.error('Error fetching quiz statistics:', error);
    return res.status(500).json({ error: 'Failed to fetch quiz statistics' });
  }
});

// list all quizzes
router.get('/quizzes', async (req: Request, res: Response) => {
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
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: {
        creator: { columns: { id: true, name: true, email: true } },
        questions: {
          orderBy: (questions, { asc }) => [asc(questions.order)]
        }
      },
      orderBy: [desc(quiz.createdAt)]
    });
    const filtered_rows = quizzes.length;
    const total_rows = await db.select({ count: count() }).from(quiz);

    const result = quizzes.map((q) => ({
      ...q,
      isPublished: q.status === 'published',
      questions: q.questions.map((ques) => ({
        ...ques,
        text: ques.questionText
      }))
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

// create quiz
router.post('/quizzes', async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      difficulty,
      category,
      timeLimit,
      passingScore,
      questions: questionsData
    } = req.body;

    // insert quiz
    const [createdQuiz] = await db
      .insert(quiz)
      .values({
        title,
        description,
        difficulty,
        category,
        timeLimit,
        passingScore,
        status: 'draft',
        createdBy: req.user!.id
      })
      .returning();

    if (questionsData && questionsData.length > 0) {
      const questionValues = questionsData.map((q: QuestionInput, index: number) => ({
        quizId: createdQuiz.id,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        points: q.points || 1,
        order: index
      }));

      await db.insert(question).values(questionValues);
    }

    const quizWithDetails = await db.query.quiz.findFirst({
      where: eq(quiz.id, createdQuiz.id),
      with: {
        creator: { columns: { id: true, name: true, email: true } },
        questions: {
          orderBy: (questions, { asc }) => [asc(questions.order)]
        }
      }
    });

    if (!quizWithDetails) {
      return res.status(500).json({ error: 'Failed to create quiz' });
    }

    const result = {
      ...quizWithDetails,
      isPublished: quizWithDetails.status === 'published',
      questions: quizWithDetails.questions.map((ques) => ({
        ...ques,
        text: ques.questionText
      }))
    };

    return res.status(201).json(result);
  } catch (error) {
    console.error('Error creating quiz:', error);
    return res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// update quiz
router.put('/quizzes/:id', async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      difficulty,
      category,
      timeLimit,
      passingScore,
      status,
      questions: questionsData
    } = req.body;

    await db
      .update(quiz)
      .set({
        title,
        description,
        difficulty,
        category,
        timeLimit,
        passingScore,
        status,
        updatedAt: new Date()
      })
      .where(eq(quiz.id, req.params.id));

    if (questionsData) {
      await db.delete(question).where(eq(question.quizId, req.params.id));

      if (questionsData.length > 0) {
        const questionValues = questionsData.map((q: QuestionInput, index: number) => ({
          quizId: req.params.id,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          points: q.points || 1,
          order: index
        }));

        await db.insert(question).values(questionValues);
      }
    }

    const updatedQuiz = await db.query.quiz.findFirst({
      where: eq(quiz.id, req.params.id),
      with: {
        creator: { columns: { id: true, name: true, email: true } },
        questions: {
          orderBy: (questions, { asc }) => [asc(questions.order)]
        }
      }
    });

    const result = {
      ...updatedQuiz,
      isPublished: updatedQuiz?.status === 'published',
      questions:
        updatedQuiz?.questions.map((ques) => ({
          ...ques,
          text: ques.questionText
        })) || []
    };

    return res.json(result);
  } catch (error) {
    console.error('Error updating quiz:', error);
    return res.status(500).json({ error: 'Failed to update quiz' });
  }
});

// delete quiz
router.delete('/quizzes/:id', async (req: Request, res: Response) => {
  try {
    await db.delete(quiz).where(eq(quiz.id, req.params.id));
    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

// toggle quiz publish status
router.patch('/quizzes/:id/publish', async (req: Request, res: Response) => {
  try {
    const { isPublished } = req.body;
    const status = isPublished ? 'published' : 'draft';

    await db
      .update(quiz)
      .set({
        status,
        updatedAt: new Date()
      })
      .where(eq(quiz.id, req.params.id));

    const updatedQuiz = await db.query.quiz.findFirst({
      where: eq(quiz.id, req.params.id),
      with: {
        creator: { columns: { id: true, name: true, email: true } },
        questions: { orderBy: (questions, { asc }) => [asc(questions.order)] }
      }
    });

    if (!updatedQuiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    return res.json(updatedQuiz);
  } catch (error) {
    console.error('Error toggling quiz publish status:', error);
    return res.status(500).json({ error: 'Failed to toggle quiz publish status' });
  }
});

// list all users
router.get('/users', async (req: Request, res: Response) => {
  try {
    const usersList = await db.query.users.findMany({
      with: {
        quizAttempts: {
          columns: { id: true, score: true, completedAt: true }
        }
      },
      orderBy: [desc(users.createdAt)]
    });

    const result = usersList.map((u) => ({
      ...u,
      attemptCount: u.quizAttempts.length,
      quizAttempts: undefined
    }));

    return res.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
