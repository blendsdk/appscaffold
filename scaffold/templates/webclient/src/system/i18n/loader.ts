/**
 * Fetches translations for the given locale from the backend API.
 * Used as the loader function for the I18nProvider.
 *
 * @param locale - The locale code to fetch translations for (e.g. 'en', 'nl')
 * @returns A record of translation key-value pairs
 */
export async function fetchTranslations(locale: string): Promise<Record<string, string>> {
    const response = await fetch(`/api/translations/${locale}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch translations for locale "${locale}": ${response.statusText}`);
    }
    return response.json();
}
