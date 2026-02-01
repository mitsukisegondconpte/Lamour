export * from "./models/auth";
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export const surprises = pgTable("surprises", {
  id: serial("id").primaryKey(),
  senderId: text("sender_id").notNull(), // References auth user id
  receiverName: text("receiver_name").notNull(),
  message: text("message").notNull(),
  musicUrl: text("music_url"),
  status: text("status").notNull().default("pending"), // pending, viewed, accepted, rejected, cancelled
  linkSlug: text("link_slug").notNull().unique(),
  isAnonymous: boolean("is_anonymous").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const surpriseMedia = pgTable("surprise_media", {
  id: serial("id").primaryKey(),
  surpriseId: integer("surprise_id").notNull().references(() => surprises.id),
  type: text("type").notNull(), // photo, video
  url: text("url").notNull(),
  order: integer("order").notNull(),
});

export const surpriseResponses = pgTable("surprise_responses", {
  id: serial("id").primaryKey(),
  surpriseId: integer("surprise_id").notNull().references(() => surprises.id),
  responseType: text("response_type").notNull(), // accept, reject, reply
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const surpriseViews = pgTable("surprise_views", {
  id: serial("id").primaryKey(),
  surpriseId: integer("surprise_id").notNull().references(() => surprises.id),
  viewedAt: timestamp("viewed_at").defaultNow(),
  viewerIp: text("viewer_ip"),
});

// Relations
export const surprisesRelations = relations(surprises, ({ one, many }) => ({
  sender: one(users, {
    fields: [surprises.senderId],
    references: [users.id],
  }),
  media: many(surpriseMedia),
  responses: many(surpriseResponses),
  views: many(surpriseViews),
}));

export const surpriseMediaRelations = relations(surpriseMedia, ({ one }) => ({
  surprise: one(surprises, {
    fields: [surpriseMedia.surpriseId],
    references: [surprises.id],
  }),
}));

export const surpriseResponsesRelations = relations(surpriseResponses, ({ one }) => ({
  surprise: one(surprises, {
    fields: [surpriseResponses.surpriseId],
    references: [surprises.id],
  }),
}));

// Schemas
export const insertSurpriseSchema = createInsertSchema(surprises).omit({ 
  id: true, 
  createdAt: true, 
  senderId: true,
  status: true,
  linkSlug: true 
});

export const insertResponseSchema = createInsertSchema(surpriseResponses).omit({ 
  id: true, 
  createdAt: true,
  surpriseId: true
});

// Types
export type Surprise = typeof surprises.$inferSelect;
export type InsertSurprise = z.infer<typeof insertSurpriseSchema>;
export type SurpriseMedia = typeof surpriseMedia.$inferSelect;
export type SurpriseResponse = typeof surpriseResponses.$inferSelect;
export type InsertResponse = z.infer<typeof insertResponseSchema>;
