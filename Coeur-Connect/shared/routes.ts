import { z } from 'zod';
import { insertSurpriseSchema, insertResponseSchema, surprises, surpriseMedia, surpriseResponses } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  surprises: {
    create: {
      method: 'POST' as const,
      path: '/api/surprises',
      input: insertSurpriseSchema.extend({
        media: z.array(z.object({
          type: z.enum(['photo', 'video']),
          url: z.string()
        })).optional()
      }),
      responses: {
        201: z.custom<typeof surprises.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/surprises',
      responses: {
        200: z.array(z.custom<typeof surprises.$inferSelect & { responses: typeof surpriseResponses.$inferSelect[], views: number }>()),
      },
    },
    getPublic: {
      method: 'GET' as const,
      path: '/api/surprises/public/:slug',
      responses: {
        200: z.custom<typeof surprises.$inferSelect & { media: typeof surpriseMedia.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
    cancel: {
      method: 'PATCH' as const,
      path: '/api/surprises/:id/cancel',
      responses: {
        200: z.custom<typeof surprises.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    respond: {
      method: 'POST' as const,
      path: '/api/surprises/:id/respond',
      input: insertResponseSchema,
      responses: {
        201: z.custom<typeof surpriseResponses.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  media: {
    upload: {
      method: 'POST' as const,
      path: '/api/media/upload',
      // input is multipart/form-data
      responses: {
        200: z.object({ url: z.string() }),
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
