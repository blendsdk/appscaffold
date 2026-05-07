import { BaseController } from 'blendsdk/webafx';
import { PostgreSQLDatabase } from 'blendsdk/postgresql';
import type { CacheProvider } from 'blendsdk/webafx-cache';
import type { Request, Response } from 'express';

export class HealthController extends BaseController {
    routes() {
        return [
            this.route().get('/').handle(this.check),
        ];
    }

    async check(req: Request, res: Response) {
        const log = req.log!;
        const checks: Record<string, string> = {};

        // Database check
        try {
            const db = await req.services.get<PostgreSQLDatabase>('db');
            await db.executeQuery('SELECT 1');
            checks.database = 'ok';
        } catch {
            checks.database = 'error';
            await log.error('Database health check failed');
        }

        // Cache check
        try {
            const cache = await req.services.get<CacheProvider>('cache');
            await cache.getOrSet('health:ping', async () => 'pong', 10);
            checks.cache = 'ok';
        } catch {
            checks.cache = 'error';
            await log.error('Cache health check failed');
        }

        const allOk = Object.values(checks).every((v) => v === 'ok');
        const status = allOk ? 200 : 503;

        await log.info('Health check completed', {
            status: allOk ? 'ok' : 'degraded',
            checks,
        });

        res.status(status).json({
            status: allOk ? 'ok' : 'degraded',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            checks,
        });
    }
}
