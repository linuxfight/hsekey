import {Elysia, t} from "elysia";
import { db } from "../db/connection";
import { stats } from "../db/schema";
import { eq, and, gte, lt } from "drizzle-orm/sql/expressions/conditions";
import { getUser } from "../utils/user";
import {jwt} from "@elysiajs/jwt";
import "dotenv";

export const statsRouter = new Elysia()
  .use(jwt({
    name: 'jwt',
    secret: Bun.env.JWT_SECRET!,
  }))
    .error({
        "NOT_FOUND": Error
    })
    .model({
        "error": t.Object({
            message: t.String()
        })
    })
    .post("/api/stats/report", async ({ body, jwt, headers, status }) => {
        const { count, activity } = body;
        const token = headers['authorization'];

          const verified = await jwt.verify(token);

          if (!verified) {
            return status(401, {
              message: "UNAUTHORIZED"
            });
          }

          const user = await getUser(verified);

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
    }, {
        body: t.Object({
            count: t.Number(),
            activity: t.String(),
        }),
        response: {
            200: t.Object({
                ok: t.Boolean()
            }),
            401: "error",
            500: "error"
        },
        detail: {
            description: "Report a user\'s activity. Requires a valid auth token.",
            tags: ["stats"]
        }
    });
