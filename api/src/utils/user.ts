import { db } from "../db/connection";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { users } from "../db/schema";

export async function getUser(claims: any): Promise<{
    id: number
    email: string
    passwordHash: string
    points: number
    createdAt: string
}> {
    if (!claims || !claims.id) {
        throw new Error("Invalid credentials");
    }

    const usersList = await db
        .select().from(users).limit(1)
        .where(eq(users.id, claims.id));

    if (usersList.length === 0) {
        throw new Error("Invalid credentials");
    }

    return usersList[0];
}
