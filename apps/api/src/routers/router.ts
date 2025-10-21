import { t } from '../trpc';
import { authRouter } from './auth.router';
import { statsRouter } from './stats.router';

export const appRouter = t.router({
    auth: authRouter,
    stats: statsRouter,
});

export type AppRouter = typeof appRouter;