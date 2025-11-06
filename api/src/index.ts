import Elysia from "elysia";
import { productsRouter } from "./handlers/products.router";
import { statsRouter } from "./handlers/stats.router";
import { authRouter } from "./handlers/auth.router";
import openapi from "@elysiajs/openapi";

if (!Bun.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
}

const app = new Elysia()
  .use(openapi({
    documentation: {
      info: {
        title: 'HSE KEY API',
        version: '1.0.0'
      }
    }
  }))
  .use(authRouter)
  .use(productsRouter)
  .use(statsRouter);

console.log("api running on http://0.0.0.0:3000");

app.listen(3000);
