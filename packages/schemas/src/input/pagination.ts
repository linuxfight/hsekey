import { z } from "zod";

export const PaginationInputSchema = z.object({
    page: z.number().min(1),
    limit: z.number().min(4).max(20),
    token: z.string().min(60).max(120)
});