import { z } from "zod";

export const AuthInputSchema = z.object({
  email: z.email().max(100),
  password: z.string().min(8),
});

export const TokenInputSchema = z.object({
    token: z.string().min(60).max(120)
});
