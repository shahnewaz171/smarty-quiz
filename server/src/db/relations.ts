import { relations } from 'drizzle-orm';
import {
  session,
  users,
  account,
  quiz,
  quizAttempt,
  question,
  activeQuizSession
} from './schema.js';

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  quizzesCreated: many(quiz),
  quizAttempts: many(quizAttempt),
  activeQuizSessions: many(activeQuizSession)
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(users, {
    fields: [session.userId],
    references: [users.id]
  })
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(users, {
    fields: [account.userId],
    references: [users.id]
  })
}));

export const quizRelations = relations(quiz, ({ one, many }) => ({
  creator: one(users, {
    fields: [quiz.createdBy],
    references: [users.id]
  }),
  questions: many(question),
  attempts: many(quizAttempt)
}));

export const questionRelations = relations(question, ({ one }) => ({
  quiz: one(quiz, {
    fields: [question.quizId],
    references: [quiz.id]
  })
}));

export const quizAttemptRelations = relations(quizAttempt, ({ one }) => ({
  quiz: one(quiz, {
    fields: [quizAttempt.quizId],
    references: [quiz.id]
  }),
  user: one(users, {
    fields: [quizAttempt.userId],
    references: [users.id]
  })
}));

export const activeQuizSessionRelations = relations(activeQuizSession, ({ one }) => ({
  quiz: one(quiz, {
    fields: [activeQuizSession.quizId],
    references: [quiz.id]
  }),
  user: one(users, {
    fields: [activeQuizSession.userId],
    references: [users.id]
  })
}));
