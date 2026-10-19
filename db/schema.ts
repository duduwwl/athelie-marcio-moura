import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
export const dresses = sqliteTable('dresses', {id:text('id').primaryKey(),data:text('data').notNull(),published:integer('published').notNull().default(1),created:text('created').notNull()});
export const inquiries = sqliteTable('inquiries', {id:text('id').primaryKey(),kind:text('kind').notNull(),name:text('name').notNull(),phone:text('phone').notNull(),date:text('date'),time:text('time'),dressId:text('dress_id'),data:text('data').notNull(),status:text('status').notNull().default('Aguardando confirmação'),created:text('created').notNull()});
export const settings = sqliteTable('settings', {id:text('id').primaryKey(),data:text('data').notNull()});
export const blocks = sqliteTable('blocks', {id:text('id').primaryKey(),date:text('date').notNull(),time:text('time').notNull()},t=>[uniqueIndex('blocked_slot').on(t.date,t.time)]);
export const slots = sqliteTable('slots', {id:text('id').primaryKey(),inquiryId:text('inquiry_id').notNull()});
export const rateLimits = sqliteTable('rate_limits', {id:text('id').primaryKey(),count:integer('count').notNull(),expires:integer('expires').notNull()});

