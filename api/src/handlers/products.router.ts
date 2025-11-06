import {Elysia, t} from "elysia";
import { eq, gt, and, ilike } from "drizzle-orm/sql/expressions/conditions";
import { db } from "../db/connection";
import { products, transactions } from "../db/schema";
import { getUser } from "../utils/user";
import { generatePromoCode } from "../utils/promocode";
import {jwt} from "@elysiajs/jwt";
import "dotenv";

export const productsRouter = new Elysia()
  .use(jwt({
    name: 'jwt',
    secret: Bun.env.JWT_SECRET!,
  }))
    .error({
        "NOT_FOUND": Error,
        "FORBIDDEN": Error
    })
    .model({
        "error": t.Object({
            message: t.String()
        }),
        "promocode": t.Object({
            code: t.String()
        })
    })
    .get("/api/products/balance", async ({ jwt, headers, status }) => {
      const token = headers['authorization'];

        const verified = await jwt.verify(token);

        if (!verified) {
          return status(401, {
            message: "UNAUTHORIZED"
          });
        }

        const user = await getUser(verified);

        return { balance: user.points };
    }, {
        response: {
            200: t.Object({
                balance: t.Number()
            }),
            401: "error",
            500: "error"
        },
        detail: {
            description: "Get the current user\'s balance. Requires a valid auth token.",
            tags: ["products"]
        }
    })
    .post("/api/products/buy", async ({ body, jwt, headers, status }) => {
        const { productId } = body;

        const token = headers['authorization'];

          const verified = await jwt.verify(token);

          if (!verified) {
            return status(401, {
              message: "UNAUTHORIZED"
            });
          }

          const user = await getUser(verified);

        const productList = await db
            .select()
            .from(products)
            .where(and(
                gt(products.amount, 0),
                eq(products.id, productId)
            )).limit(1);

        if (productList.length == 0) {
            return status(404, {
              message: "NOT_FOUND"
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
                return status(403, {
                  message: "FORBIDDEN"
                });
            }
        }
    }, {
        body: t.Object({
            productId: t.Number(),
        }),
        response: {
            200: "promocode",
            401: "error",
            403: "error",
            404: "error",
            500: "error"
        },
        detail: {
            description: "Buy a product. Requires a valid auth token.",
            tags: ["products"]
        }
    })
    .get("/api/products/search", async ({ jwt, headers, status, query }) => {
       const { limit, page, query: searchQuery } = query;
       const token = headers['authorization'];

         const verified = await jwt.verify(token);

         if (!verified) {
           return status(401, {
             message: "UNAUTHORIZED"
           });
         }

         const user = await getUser(verified);

        return await db
            .select().from(products).limit(limit)
            .offset(limit * (page - 1))
            .where(and(
                gt(products.amount, 0),
                ilike(products.name, `%${searchQuery}%`)
            ));
    }, {
        query: t.Object({
            page: t.Numeric(),
            limit: t.Numeric(),
            query: t.String(),
        }),
        response: {
            200: t.Array(t.Object({
                id: t.Number(),
                name: t.String(),
                price: t.Number(),
                amount: t.Number(),
                imageUrl: t.String(),
                createdAt: t.Date()
            })),
            401: "error",
            500: "error"
        },
        detail: {
            description: "Search for products. Requires a valid auth token.",
            tags: ["products"]
        }
    })
    .get("/api/products/list", async ({ query, status, headers, jwt }) => {
        const { page, limit } = query;
        const token = headers['authorization'];

          const verified = await jwt.verify(token);

          if (!verified) {
            return status(401, {
              message: "UNAUTHORIZED"
            });
          }

          const user = await getUser(verified);

        return await db
            .select().from(products).limit(limit)
            .offset(limit * (page - 1))
            .where(gt(products.amount, 0));
    }, {
        query: t.Object({
            page: t.Numeric(),
            limit: t.Numeric(),
        }),
        response: {
            200: t.Array(t.Object({
                id: t.Number(),
                name: t.String(),
                price: t.Number(),
                amount: t.Number(),
                imageUrl: t.String(),
                createdAt: t.Date()
            })),
            401: "error",
            500: "error"
        },
        detail: {
            description: "List all products. Requires a valid auth token.",
            tags: ["products"]
        }
    });
