import type { Express } from "express";
import { isAuthenticated } from "./replitAuth";

export function registerAuthRoutes(app: Express): void {
  // Get current authenticated user
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const { password, ...safeUser } = req.user;
      res.json(safeUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
}
