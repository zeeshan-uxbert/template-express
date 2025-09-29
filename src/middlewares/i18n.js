import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function i18nMiddleware() {
	if (!i18next.isInitialized) {
		await i18next
			.use(Backend)
			.use(i18nextMiddleware.LanguageDetector)
			.init({
				fallbackLng: 'en',
				backend: { loadPath: path.join(__dirname, '../../locales/{{lng}}/{{ns}}.json') },
				supportedLngs: ['en', 'ar'],
				detection: { order: ['header'], caches: false },
				preload: ['en'],
			});
	}
	return i18nextMiddleware.handle(i18next);
}


