import { z } from "zod";

export const StatsInputSchema = z.object({
    count: z.number().min(0).max(150000),
    activity: z.string().min(0).max(1000),
    token: z.string().min(60).max(120)
});
