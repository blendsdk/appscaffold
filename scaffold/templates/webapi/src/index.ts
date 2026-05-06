import { WebApplication } from 'blendsdk/webafx';
import type { ServiceContainer, ApplicationSettings } from 'blendsdk/webafx';
import { PostgreSQLDatabase } from 'blendsdk/postgresql';
import { redisCachePlugin } from 'blendsdk/webafx-cache';
{{WEBAPI_PLUGIN_IMPORTS}}
import { HealthController } from './controllers/health-controller.js';

const app = new WebApplication({
    PORT: {{BACKEND_PORT}},
    ENV_MODE: 'development',
    LOG_LEVEL: 'INFO',
    CORS: true,
});

// Database service
app.registerService({
    name: 'db',
    type: 'singleton',
    factory: async (container: ServiceContainer, settings: ApplicationSettings) => {
        const db = new PostgreSQLDatabase({
            host: settings.get('DB_HOST', 'localhost'),
            port: settings.get('DB_PORT', {{DB_PORT}}),
            database: settings.get('DB_NAME', '{{DB_NAME}}'),
            user: settings.get('DB_USER', '{{DB_NAME}}'),
            pass: settings.get('DB_PASSWORD', 'secret'),
        });
        await db.connect();
        return db;
    },
    dispose: async (db: unknown) => await (db as PostgreSQLDatabase).disconnect(),
});

// Redis cache plugin
app.use(redisCachePlugin({
    rootKey: '{{PROJECT_NAME_LOWER}}',
    host: 'localhost',
    port: {{REDIS_PORT}},
    password: 'secret',
    defaultTTL: 300,
}));

{{WEBAPI_PLUGIN_REGISTRATIONS}}

// Controllers
app.registerController('/api/health', HealthController);

const shutdown = await app.start();
