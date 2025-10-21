import { t } from "../trpc";
import {
    PaginationInputSchema,
    SearchInputSchema,
    ProductCreateInputSchema,
    TokenInputSchema,
    BuyInputSchema
} from "@repo/schemas";
import { eq, gt, and, ilike } from "drizzle-orm/sql/expressions/conditions";
import { db } from "../db/connection";
import { products, transactions } from "../db/schema";
import { getUser } from "../utils/user";
import { TRPCError } from "@trpc/server";
import { generatePromoCode } from "../utils/promocode";

export const productsRouter = t.router({
    create: t.procedure
        .input(ProductCreateInputSchema)
        .mutation(async ({ input }) => {
            const { name, price, amount, imageUrl, token } = input;

            await getUser(token);

            await db
                .insert(products)
                .values({ name, price, amount, imageUrl });

            return { ok: true };
        }),
    balance: t.procedure
        .input(TokenInputSchema)
        .query(async ({ input }) => {
            const { token } = input;

            const user = await getUser(token);

            return { balance: user.points };
        }),
    buy: t.procedure
        .input(BuyInputSchema)
        .mutation(async ({ input }) => {
            const { productId, token } = input;

            const user = await getUser(token);

            const productList = await db
                .select()
                .from(products)
                .where(and(
                    gt(products.amount, 0),
                    eq(products.id, productId)
                )).limit(1);

            if (productList.length == 0) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `No product found for id = ${productId}`
                });
            } else {
                const product = productList[0];

                if (user.points >= product.price) {
                    await db
                        .update(products)
                        .set({ amount: product.amount - 1})
                        .where(eq(products.id, productId));

                    await db
                        .insert(transactions)
                        .values({ price: product.price, amount: 1, userId: user.id, productId: productId });

                    return { code: generatePromoCode() };
                } else {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: "Not enough points"
                    });
                }
            }
        }),
    search: t.procedure
        .input(SearchInputSchema)
        .query(async ({ input }) => {
           const { limit, page, query, token } = input;

            await getUser(token);

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

            await getUser(token);

            return await db
                .select().from(products).limit(limit)
                .offset(limit * (page - 1))
                .where(gt(products.amount, 0));
        }),
});