import * as jwt from "./jwt";
import { db } from "../db/connection";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { users } from "../db/schema";
import { TRPCError } from "@trpc/server";

export async function getUser(token: string): Promise<{
    id: number
    email: string
    passwordHash: string
    points: number
    createdAt: string
}> {
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

    return usersList[0];
}