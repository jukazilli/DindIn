import { z } from "zod";
import { UuidSchema } from "./core";

export const ApiErrorCodeSchema = z.enum([
  "VALIDATION_ERROR",
  "UNAUTHORIZED",
  "NOT_FOUND",
  "CONFLICT",
  "DOMAIN_INVARIANT",
  "INTERNAL_ERROR",
]);

export const ApiErrorSchema = z.object({
  error: z.object({
    code: ApiErrorCodeSchema,
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

export const CreatedEntitySchema = z.object({
  id: UuidSchema,
  version: z.number().int().min(1),
});

export const CreatedProfileSchema = z.object({
  userId: UuidSchema,
  version: z.number().int().min(1),
});

export const HealthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.literal("dindin-api"),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
export type CreatedEntity = z.infer<typeof CreatedEntitySchema>;
export type CreatedProfile = z.infer<typeof CreatedProfileSchema>;
