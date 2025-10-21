import { pgTable, serial, integer, timestamp, varchar, boolean } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 100 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    points: integer('points').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const stats = pgTable('stats', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    activity: varchar('activity', { length: 255 }).notNull(),
    count: integer('count').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const products = pgTable('goods', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    price: integer('price').notNull(),
    amount: integer('amount').notNull(),
    imageUrl: varchar('image_url', { length: 2048 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
    id: serial('id').primaryKey(),
    price: integer('price').notNull(),
    amount: integer('amount').notNull(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    cancelled: boolean('cancelled').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
    stats: many(stats),
    transactions: many(transactions),
}));

export const statsRelations = relations(stats, ({ one }) => ({
    user: one(users, {
        fields: [stats.userId],
        references: [users.id],
    }),
}));

export const productsRelations = relations(products, ({ many }) => ({
    logs: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
    user: one(users, {
        fields: [transactions.userId],
        references: [users.id],
    }),
    product: one(products, {
        fields: [transactions.productId],
        references: [products.id],
    }),
}));
