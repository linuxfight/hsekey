import { t } from "../trpc";
import { db } from "../db/connection";
import { stats } from "../db/schema";
import { StatsInputSchema } from "@repo/schemas";
import { eq, and, gte, lt } from "drizzle-orm/sql/expressions/conditions";
import { getUser } from "../utils/user";

export const statsRouter = t.router({
    report: t.procedure
        .input(StatsInputSchema)
        .mutation(async ({ input }) => {
            const { count, activity, token } = input;

            const user = await getUser(token);

            // Get start of today
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);

            // Get start of tomorrow
            const startOfTomorrow = new Date(startOfToday);
            startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

            const statsList = await db
                .select().from(stats).limit(1)
                .where(and(
                    eq(stats.userId, user.id),
                    eq(stats.activity, activity),
                    gte(stats.createdAt, startOfToday.toISOString()),
                    lt(stats.createdAt, startOfTomorrow.toISOString())
                ));

            if (statsList.length == 0) {
                await db
                    .insert(stats).values({
                        userId: user.id,
                        activity: activity,
                        count: count
                    })
            } else {
                const stat = statsList[0];

                if (count > stat.count) {
                    await db
                        .update(stats).set({ count: count })
                        .where(and(
                            eq(stats.userId, user.id),
                            eq(stats.activity, activity),
                            gte(stats.createdAt, startOfToday.toISOString()),
                            lt(stats.createdAt, startOfTomorrow.toISOString())
                        ));
                }
            }

            return { ok: true };
        }),
});
