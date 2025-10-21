import {t} from "../trpc";
import {PaginationInputSchema, SearchInputSchema} from "@repo/schemas";
import {eq, gt, and, ilike} from "drizzle-orm/sql/expressions/conditions";
import * as jwt from "../utils/jwt";
import {db} from "../db/connection";
import {products, users} from "../db/schema";
import {TRPCError} from "@trpc/server";

export const productsRouter = t.router({
    search: t.procedure
        .input(SearchInputSchema)
        .query(async ({ input }) => {
           const { limit, page, query, token } = input;

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

            return await db
                .select().from(products).limit(limit)
                .offset(limit * (page - 1))
                .where(and(
                    gt(products.amount, 0),
                    ilike(products.name, query)
                ));
        }),
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

            return await db
                .select().from(products).limit(limit)
                .offset(limit * (page - 1))
                .where(gt(products.amount, 0));
        }),
});