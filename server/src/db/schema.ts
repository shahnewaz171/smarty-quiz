import { pgTable, text, timestamp, boolean, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// auth tables
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  lastLoginAt: timestamp('lastLoginAt'),
  role: jsonb('role').$type<string[]>().notNull().default(['user'])
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow()
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow()
});

// quiz tables
export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard']);
export const quizStatusEnum = pgEnum('quiz_status', ['draft', 'published', 'unpublished']);

export const quiz = pgTable('quiz', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  description: text('description'),
  difficulty: difficultyEnum('difficulty').notNull().default('medium'),
  category: text('category').notNull(),
  timeLimit: integer('timeLimit'),
  passingScore: integer('passingScore').notNull().default(70),
  status: quizStatusEnum('status').notNull().default('draft'),
  createdBy: text('createdBy')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow()
});

export const question = pgTable('question', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  quizId: text('quizId')
    .notNull()
    .references(() => quiz.id, { onDelete: 'cascade' }),
  questionText: text('questionText').notNull(),
  options: jsonb('options').notNull(),
  correctAnswer: text('correctAnswer').notNull(),
  explanation: text('explanation'),
  points: integer('points').notNull().default(1),
  order: integer('order').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow()
});

export const quizAttempt = pgTable('quiz_attempt', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  quizId: text('quizId')
    .notNull()
    .references(() => quiz.id, { onDelete: 'cascade' }),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  answers: jsonb('answers').notNull(),
  score: integer('score').notNull(),
  totalQuestions: integer('totalQuestions').notNull(),
  correctAnswers: integer('correctAnswers').notNull(),
  passed: boolean('passed').notNull(),
  startedAt: timestamp('startedAt').notNull(),
  completedAt: timestamp('completedAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow()
});

export const activeQuizSession = pgTable('active_quiz_session', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  quizId: text('quizId')
    .notNull()
    .references(() => quiz.id, { onDelete: 'cascade' }),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  startedAt: timestamp('startedAt').notNull().defaultNow(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow()
});
