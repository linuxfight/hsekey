import { t } from '../trpc';
import { authRouter } from './auth.router';
import { statsRouter } from './stats.router';
import { productsRouter } from './products.router';

export const appRouter = t.router({
    auth: authRouter,
    stats: statsRouter,
    products: productsRouter,
});

export type AppRouter = typeof appRouter;