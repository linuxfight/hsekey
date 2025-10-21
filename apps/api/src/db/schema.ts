import { pgTable, serial, integer, timestamp, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 100 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

// Stats table
export const stats = pgTable('stats', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    activity: varchar('activity', { length: 255 }).notNull(),
    count: integer('count').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

// Goods table
export const goods = pgTable('goods', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    price: integer('price').notNull(), // Store in smallest currency unit (e.g., cents)
    amount: integer('amount').notNull(),
    imageUrl: varchar('image_url', { length: 2048 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

// Goods logs table
export const goodsLogs = pgTable('goods_logs', {
    id: serial('id').primaryKey(),
    price: integer('price').notNull(), // Store in smallest currency unit (e.g., cents)
    goodId: integer('good_id').notNull().references(() => goods.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    stats: many(stats),
}));

export const statsRelations = relations(stats, ({ one }) => ({
    user: one(users, {
        fields: [stats.userId],
        references: [users.id],
    }),
}));

export const goodsRelations = relations(goods, ({ many }) => ({
    logs: many(goodsLogs),
}));

export const goodsLogsRelations = relations(goodsLogs, ({ one }) => ({
    good: one(goods, {
        fields: [goodsLogs.goodId],
        references: [goods.id],
    }),
}));