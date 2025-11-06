import {Elysia, t} from "elysia";
import { db } from "@/db/connection";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm/sql/expressions/conditions";

export const authRouter = new Elysia()
    .error({
        "UNAUTHORIZED": Error
    })
    .model({
        "error": t.Object({
            message: t.String()
        }),
        "token": t.Object({
            token: t.String()
        })
    })
    .post("/api/auth/login", async ({ body, status, jwt }) => {
        const { email, password } = body;

        // Find existing user
        const usersList = await db
            .select()
            .from(users)
            .limit(1)
            .where(eq(users.email, email));

        if (usersList.length === 1) {
            const user = usersList[0];

            // Verify password (Bun password API as in your original code)
            const isValid = await Bun.password.verify(password, user.passwordHash);

            if (!isValid) {
                return status(401, {
                  message: 'UNAUTHORIZED'
                });
            }

            const token = await jwt.sign({ id: user.id });

            return { token };
        } else {
            // Create user when not found (same behaviour as your original code)
            const passwordHash = await Bun.password.hash(password);

            const newUsersList = await db
                .insert(users)
                .values({
                    email,
                    passwordHash,
                })
                .returning({ id: users.id, email: users.email });

            const token = await jwt.sign({ id: newUsersList[0].id });

            return { token };
        }
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String(),
        }),
        response: {
            200: "token",
            401: "error",
            500: "error"
        },
        detail: {
            description: "Login or register a new user.",
            tags: ["auth"]
        }
    });
