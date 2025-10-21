import { t } from "../trpc";
import {db} from "../db/connection";
import {users,stats} from "../db/schema";
import {StatsInputSchema} from "@repo/schemas";
import { eq, and, gte, lt } from "drizzle-orm/sql/expressions/conditions";
import * as jwt from '../utils/jwt';
import { TRPCError } from "@trpc/server";

export const statsRouter = t.router({
    report: t.procedure
        .input(StatsInputSchema)
        .mutation(async ({ input }) => {
            const { count, activity, token } = input;

            const claims = await jwt.verifyAndParse(token);

            if (claims == null) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid credentials"
                });
            }

            const usersList = await db
                .select().from(users).limit(1)
                .where(eq(users.id, claims.id));

            if (usersList.length == 0) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid credentials"
                });
            }

            // Get start of today
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);

            // Get start of tomorrow
            const startOfTomorrow = new Date(startOfToday);
            startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

            const statsList = await db
                .select().from(stats).limit(1)
                .where(and(
                    eq(stats.userId, claims.id),
                    eq(stats.activity, activity),
                    gte(stats.createdAt, startOfToday.toISOString()),
                    lt(stats.createdAt, startOfTomorrow.toISOString())
                ));

            if (statsList.length == 0) {
                await db
                    .insert(stats).values({
                        userId: claims.id,
                        activity: activity,
                        count: count
                    })
            } else {
                const stat = statsList[0];

                if (count > stat.count) {
                    await db
                        .update(stats).set({ count: count })
                        .where(and(
                            eq(stats.userId, claims.id),
                            eq(stats.activity, activity),
                            gte(stats.createdAt, startOfToday.toISOString()),
                            lt(stats.createdAt, startOfTomorrow.toISOString())
                        ));
                }
            }

            return { ok: true };
        }),
});
