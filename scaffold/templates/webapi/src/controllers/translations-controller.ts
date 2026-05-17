import type { WebRequest, WebResponse, ServiceContainer, ICache, ITranslator } from 'blendsdk/webafx';

/**
 * Translations controller — serves translation catalogs and provides
 * a server-side translation example with cache management.
 */
export class TranslationsController {
    /**
     * GET /api/translations/:locale
     * Returns all translations for the requested locale.
     * Results are cached in Redis with no expiry (manual invalidation).
     */
    async getTranslations(req: WebRequest, res: WebResponse, container: ServiceContainer): Promise<void> {
        const locale = req.params.locale ?? 'en';
        const cache = container.resolve<ICache>('cache');
        const translator = container.resolve<ITranslator>('translator');

        const translations = await cache.getOrSet(
            `i18n:${locale}`,
            async () => translator.getTranslationsForLocale(locale),
            0, // no expiry — cleared manually via admin endpoint
        );

        res.json(translations);
    }

    /**
     * GET /api/greeting
     * Server-side translation example with interpolation.
     * Resolves locale from the Accept-Language header.
     */
    async getGreeting(req: WebRequest, res: WebResponse, container: ServiceContainer): Promise<void> {
        const translator = container.resolve<ITranslator>('translator');
        const locale = req.headers['accept-language']?.split(',')[0]?.trim() ?? 'en';

        const message = translator.translate('app.welcome', locale, { name: 'Server' });
        res.json({ message });
    }

    /**
     * GET /api/admin/translations/cache/clear
     * Clears all cached translations and reloads the translator from all sources.
     */
    async clearCache(_req: WebRequest, res: WebResponse, container: ServiceContainer): Promise<void> {
        const cache = container.resolve<ICache>('cache');
        const translator = container.resolve<ITranslator>('translator');

        await cache.deletePattern('i18n:*');
        await translator.reload();

        res.json({ cleared: true });
    }
}
