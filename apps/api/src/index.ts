import { appRouter } from "./routers/router";
import Elysia from "elysia";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const app = new Elysia();

app.all('/trpc/*', async ({ request }) => {
    return fetchRequestHandler({
        endpoint: '/trpc',
        req: request,
        router: appRouter,
    });
});

(async () => {

    if (process.env.NODE_ENV === 'dev') {
        const { renderTrpcPanel } = await import("trpc-ui");

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


        console.log('tRPC Playground available at http://localhost:3000/panel');
    }

    app.listen(3000);
    console.log('listening on http://localhost:3000');
})();
