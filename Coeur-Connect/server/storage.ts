import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import { 
  surprises, surpriseMedia, surpriseResponses, surpriseViews,
  type Surprise, type InsertSurprise, 
  type SurpriseMedia, 
  type SurpriseResponse, type InsertResponse 
} from "@shared/schema";
import { users, type User } from "@shared/models/auth";

export interface IStorage {
  // Surprises
  createSurprise(surprise: InsertSurprise & { senderId: string }): Promise<Surprise>;
  getSurprise(id: number): Promise<Surprise | undefined>;
  getSurpriseBySlug(slug: string): Promise<Surprise | undefined>;
  getUserSurprises(userId: string): Promise<(Surprise & { views: number, responses: SurpriseResponse[] })[]>;
  updateSurpriseStatus(id: number, status: string): Promise<Surprise | undefined>;
  
  // Media
  addMedia(media: { surpriseId: number, type: string, url: string, order: number }): Promise<SurpriseMedia>;
  getSurpriseMedia(surpriseId: number): Promise<SurpriseMedia[]>;

  // Responses
  addResponse(response: InsertResponse): Promise<SurpriseResponse>;
  
  // Views
  addView(surpriseId: number, ip?: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createSurprise(surprise: InsertSurprise & { senderId: string }): Promise<Surprise> {
    const [newSurprise] = await db.insert(surprises).values({
      ...surprise,
      linkSlug: surprise.linkSlug || Math.random().toString(36).substring(2, 10), // Fallback if not provided
      status: "pending"
    }).returning();
    return newSurprise;
  }

  async getSurprise(id: number): Promise<Surprise | undefined> {
    const [surprise] = await db.select().from(surprises).where(eq(surprises.id, id));
    return surprise;
  }

  async getSurpriseBySlug(slug: string): Promise<Surprise | undefined> {
    const [surprise] = await db.select().from(surprises).where(eq(surprises.linkSlug, slug));
    return surprise;
  }

  async getUserSurprises(userId: string): Promise<(Surprise & { views: number, responses: SurpriseResponse[] })[]> {
    const userSurprises = await db.select().from(surprises)
      .where(eq(surprises.senderId, userId))
      .orderBy(desc(surprises.createdAt));
    
    // Enrich with views count and responses (simplified N+1 for now, or use joins)
    // For a Lite build, simple loop is fine or separate queries.
    // Let's use a simple Promise.all mapping
    return Promise.all(userSurprises.map(async (s) => {
      const responses = await db.select().from(surpriseResponses).where(eq(surpriseResponses.surpriseId, s.id));
      const views = await db.select().from(surpriseViews).where(eq(surpriseViews.surpriseId, s.id));
      return { ...s, views: views.length, responses };
    }));
  }

  async updateSurpriseStatus(id: number, status: string): Promise<Surprise | undefined> {
    const [updated] = await db.update(surprises)
      .set({ status })
      .where(eq(surprises.id, id))
      .returning();
    return updated;
  }

  async addMedia(media: { surpriseId: number, type: string, url: string, order: number }): Promise<SurpriseMedia> {
    const [newMedia] = await db.insert(surpriseMedia).values(media).returning();
    return newMedia;
  }

  async getSurpriseMedia(surpriseId: number): Promise<SurpriseMedia[]> {
    return db.select().from(surpriseMedia)
      .where(eq(surpriseMedia.surpriseId, surpriseId))
      .orderBy(desc(surpriseMedia.order));
  }

  async addResponse(response: InsertResponse): Promise<SurpriseResponse> {
    const [newResponse] = await db.insert(surpriseResponses).values(response).returning();
    return newResponse;
  }

  async addView(surpriseId: number, ip?: string): Promise<void> {
    await db.insert(surpriseViews).values({
      surpriseId,
      viewerIp: ip
    });
  }
}

export const storage = new DatabaseStorage();
