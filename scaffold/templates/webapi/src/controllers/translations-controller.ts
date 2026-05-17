import { BaseController } from 'blendsdk/webafx';
import type { CacheProvider } from 'blendsdk/webafx-cache';
import type { Translator } from 'blendsdk/webafx-i18n';
import type { Request, Response } from 'express';

/**
 * Translations controller — serves translation catalogs and provides
 * a server-side translation example with cache management.
 */
export class TranslationsController extends BaseController {
    routes() {
        // Specific routes must come before the parameterized /:locale catch-all
        return [
            this.route().get('/greeting').handle(this.getGreeting),
            this.route().get('/cache/clear').handle(this.clearCache),
            this.route().get('/:locale').handle(this.getTranslations),
        ];
    }

    /**
     * GET /api/translations/:locale
     * Returns all translations for the requested locale.
     * Results are cached in Redis with no expiry (manual invalidation).
     */
    async getTranslations(req: Request, res: Response) {
        const locale = String(req.params.locale ?? 'en');
        const cache = await req.services.get<CacheProvider>('cache');
        const translator = await req.services.get<Translator>('i18n');

        const translations = await cache.getOrSet(
            `i18n:${locale}`,
            async () => translator.getTranslationsForLocale(locale),
            0, // no expiry — cleared manually via admin endpoint
        );

        res.json(translations);
    }

    /**
     * GET /api/translations/greeting
     * Server-side translation example with interpolation.
     * Resolves locale from the Accept-Language header.
     */
    async getGreeting(req: Request, res: Response) {
        const translator = await req.services.get<Translator>('i18n');
        const locale = req.headers['accept-language']?.split(',')[0]?.trim() ?? 'en';

        const message = translator.translate('app.welcome', locale, { name: 'Server' });
        res.json({ message });
    }

    /**
     * GET /api/translations/cache/clear
     * Reloads translation sources from disk and clears the Redis cache.
     * The next request will serve freshly loaded translations.
     */
    async clearCache(_req: Request, res: Response) {
        const reload = await _req.services.get<() => Promise<void>>('i18n:reload');
        const cache = await _req.services.get<CacheProvider>('cache');

        await reload();
        await cache.deletePattern('i18n:*');

        res.json({ cleared: true, reloaded: true });
    }
}
