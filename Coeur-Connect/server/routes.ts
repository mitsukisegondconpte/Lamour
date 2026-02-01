import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from "express";

// Setup uploads directory
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage
const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Serve uploads
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Surprises API
  app.post(api.surprises.create.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const input = api.surprises.create.input.parse(req.body);
      const userId = (req.user as any).claims.sub;
      const slug = Math.random().toString(36).substring(2, 10); // Simple slug

      const surprise = await storage.createSurprise({
        ...input,
        linkSlug: slug,
        senderId: userId
      });

      // Add media if present
      if (input.media) {
        let order = 0;
        for (const m of input.media) {
          await storage.addMedia({
            surpriseId: surprise.id,
            type: m.type,
            url: m.url,
            order: order++
          });
        }
      }

      res.status(201).json(surprise);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get(api.surprises.list.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = (req.user as any).claims.sub;
    const surprises = await storage.getUserSurprises(userId);
    res.json(surprises);
  });

  app.get(api.surprises.getPublic.path, async (req, res) => {
    const slug = req.params.slug;
    const surprise = await storage.getSurpriseBySlug(slug);

    if (!surprise) {
      return res.status(404).json({ message: "Surprise not found" });
    }

    // Record view
    await storage.addView(surprise.id, req.ip);

    const media = await storage.getSurpriseMedia(surprise.id);
    res.json({ ...surprise, media });
  });

  app.patch(api.surprises.cancel.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const id = parseInt(req.params.id);
    const userId = (req.user as any).claims.sub;
    
    // Verify ownership
    const surprise = await storage.getSurprise(id);
    if (!surprise || surprise.senderId !== userId) {
      return res.status(404).json({ message: "Surprise not found or access denied" });
    }

    const updated = await storage.updateSurpriseStatus(id, "cancelled");
    res.json(updated);
  });

  app.post(api.surprises.respond.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const input = api.surprises.respond.input.parse(req.body);
      
      const response = await storage.addResponse({
        ...input,
        surpriseId: id
      });

      // Update surprise status if accepted/rejected
      if (input.responseType === 'accept') {
        await storage.updateSurpriseStatus(id, 'accepted');
      } else if (input.responseType === 'reject') {
        await storage.updateSurpriseStatus(id, 'rejected');
      }

      res.status(201).json(response);
    } catch (err) {
       if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  // Media Upload
  app.post(api.media.upload.path, upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  });

  return httpServer;
}
