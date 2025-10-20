import { z } from "zod";

export const AuthInputSchema = z.object({
  email: z.email().max(100),
  password: z.string().min(8),
});

export type AuthInput = z.infer<typeof AuthInputSchema>;
