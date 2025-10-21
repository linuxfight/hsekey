import {t} from "../trpc";
import {PaginationInputSchema} from "@repo/schemas";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import * as jwt from "../utils/jwt";
import {db} from "../db/connection";
import {users} from "../db/schema";
import { TRPCError } from "@trpc/server";

export const productsRouter = t.router({
    list: t.procedure
        .input(PaginationInputSchema)
        .query(async ({ input }) => {
            const { page, limit, token } = input;

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
        }),
});