import { appRouter } from "./routers/router";
import Elysia from "elysia";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { renderTrpcPanel } from "trpc-ui";

const app = new Elysia();

app.all('/trpc/*', async ({ request }) => {
    return fetchRequestHandler({
        endpoint: '/trpc',
        req: request,
        router: appRouter,
    });
});

app.all('/panel', () => {
    return new Response(
        renderTrpcPanel(appRouter, {
            url: 'http://localhost:3000/trpc',
            // transformer: 'superjson', // or 'undefined' if you're not using a transformer
        }),
        {
            headers: {
                'Content-Type': 'text/html',
            },
        }
    );
});

app.listen(3000);
console.log('listening on http://localhost:3000');
console.log('tRPC Playground available at http://localhost:3000/panel');
