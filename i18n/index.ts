import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { API_BASE_URL } from '@/shared/config/api';

import en from './locales/en.json';

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

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en } },
    partialBundledLanguages: true,
    lng: getDeviceLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    backend: {
      loadPath: `${API_BASE_URL}/locales/{{lng}}.json`,
    },
  });

export default i18n;
