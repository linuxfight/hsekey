import { AuthInputSchema, AuthTokenData } from "@repo/schemas";
import { db } from "../db/connection";
import { users } from "../db/schema";
import { eq } from "drizzle-orm/sql/expressions/conditions";
import { t } from "../trpc";
import { TRPCError } from "@trpc/server";
import * as jwt from '../utils/jwt';

export const authRouter = t.router({
  login: t.procedure
    .input(AuthInputSchema)
    .mutation(async ({ input }) => {
      const { email, password } = input;

      const usersList = await db
          .select().from(users).limit(1)
          .where(eq(users.email, email));

      if (usersList.length == 1) {
          const user = usersList[0];

          const isValid = await Bun.password.verify(password, user.passwordHash);

          if (!isValid) {
              throw new TRPCError({
                  code: "UNAUTHORIZED",
                  message: "Invalid credentials"
              });
          }

          const token = await jwt.create(user.id);

          return new AuthTokenData(token);
      } else {
          const passwordHash = await Bun.password.hash(password);

          const newUsersList = await db
              .insert(users)
              .values({
                  email,
                  passwordHash,
              })
              .returning({ id: users.id, email: users.email });

          const token = await jwt.create(newUsersList[0].id);

          return new AuthTokenData(token);
      }
    }),
});
