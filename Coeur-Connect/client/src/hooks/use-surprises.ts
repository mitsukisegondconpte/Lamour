import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import type { InsertSurprise, InsertResponse } from "@shared/schema";

// Types derived from schema
type SurpriseWithDetails = z.infer<typeof api.surprises.list.responses[200]>[0];
type PublicSurprise = z.infer<typeof api.surprises.getPublic.responses[200]>;

// LIST all surprises (Dashboard)
export function useSurprises() {
  return useQuery({
    queryKey: [api.surprises.list.path],
    queryFn: async () => {
      const res = await fetch(api.surprises.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Impossible de charger les surprises");
      return api.surprises.list.responses[200].parse(await res.json());
    },
  });
}

// GET public surprise by slug
export function usePublicSurprise(slug: string) {
  return useQuery({
    queryKey: [api.surprises.getPublic.path, slug],
    enabled: !!slug,
    queryFn: async () => {
      const url = buildUrl(api.surprises.getPublic.path, { slug });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Surprise introuvable");
      return api.surprises.getPublic.responses[200].parse(await res.json());
    },
  });
}

// CREATE new surprise
export function useCreateSurprise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      // Validate with schema on client side first (optional but good practice)
      // data should match InsertSurprise + media array
      
      const res = await fetch(api.surprises.create.path, {
        method: api.surprises.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Erreur lors de la création");
      }
      
      return api.surprises.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.surprises.list.path] });
    },
  });
}

// CANCEL a surprise
export function useCancelSurprise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.surprises.cancel.path, { id });
      const res = await fetch(url, {
        method: api.surprises.cancel.method,
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Impossible d'annuler la surprise");
      return api.surprises.cancel.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.surprises.list.path] });
    },
  });
}

// RESPOND to a surprise (Public)
export function useRespondToSurprise() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertResponse }) => {
      const url = buildUrl(api.surprises.respond.path, { id });
      const res = await fetch(url, {
        method: api.surprises.respond.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) throw new Error("Erreur lors de l'envoi de la réponse");
      return api.surprises.respond.responses[201].parse(await res.json());
    },
  });
}

// UPLOAD media
export function useUploadMedia() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch(api.media.upload.path, {
        method: api.media.upload.method,
        body: formData,
        credentials: "include", // Important for auth check
      });
      
      if (!res.ok) throw new Error("Échec du téléchargement");
      return api.media.upload.responses[200].parse(await res.json());
    },
  });
}
