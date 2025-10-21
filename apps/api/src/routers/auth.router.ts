import { AuthInputSchema } from "@repo/schemas";
import { db } from "../db/connection";
import { users } from "../db/schema";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { t } from "../trpc";
import { TRPCError } from "@trpc/server";
import * as jose from 'jose';
import * as process from "node:process";

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET!
);

export const authRouter = t.router({
  login: t.procedure
    .input(AuthInputSchema)
    .mutation(async ({ input }) => {
      const { email, password } = input;

      const existingUsers = await db
          .select().from(users).limit(1)
          .where(eq(users.email, email));

      if (existingUsers.length == 1) {
          const existingUser = existingUsers[0];

          const isValid = await Bun.password.verify(password, existingUser.passwordHash);

          if (!isValid) {
              throw new TRPCError({
                  code: "UNAUTHORIZED",
                  message: "Invalid credentials"
              });
          }

          const token = await new jose.SignJWT({
              id: existingUser.id,
          }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('24h').sign(secret);

          return { token: token };
      } else {
          const passwordHash = await Bun.password.hash(password);

          const newUser = await db
              .insert(users)
              .values({
                  email,
                  passwordHash,
              })
              .returning({ id: users.id, email: users.email });

          const token = await new jose.SignJWT({
              id: newUser[0].id,
          }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('24h').sign(secret);

          return { token: token };
      }
    }),
});
