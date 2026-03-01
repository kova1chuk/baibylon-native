import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ar from './locales/ar.json';
import de from './locales/de.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import hi from './locales/hi.json';
import it from './locales/it.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import pl from './locales/pl.json';
import pt from './locales/pt.json';
import tr from './locales/tr.json';
import uk from './locales/uk.json';
import zh from './locales/zh.json';

const SUPPORTED_LANGUAGES = [
  'en',
  'uk',
  'ar',
  'zh',
  'es',
  'fr',
  'de',
  'pt',
  'ja',
  'ko',
  'hi',
  'tr',
  'pl',
  'it',
];

function getDeviceLanguage(): string {
  try {
    const { getLocales } = require('expo-localization');
    const locales = getLocales();
    if (locales.length > 0) {
      const lang = locales[0].languageCode;
      if (lang && SUPPORTED_LANGUAGES.includes(lang)) {
        return lang;
      }
    }
  } catch {
    // expo-localization native module not available (e.g. Expo Go)
  }
  return 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    uk: { translation: uk },
    ar: { translation: ar },
    zh: { translation: zh },
    es: { translation: es },
    fr: { translation: fr },
    de: { translation: de },
    pt: { translation: pt },
    ja: { translation: ja },
    ko: { translation: ko },
    hi: { translation: hi },
    tr: { translation: tr },
    pl: { translation: pl },
    it: { translation: it },
  },
  lng: getDeviceLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
