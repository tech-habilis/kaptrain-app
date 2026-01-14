/* eslint-disable import/no-named-as-default-member */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as SessionStorage from "expo-secure-store";
import { STORAGE_KEY } from "@/constants/storage-key";

import enTranslations from "./locales/en.json";
import frTranslations from "./locales/fr.json";

const resources = {
  en: { translation: enTranslations },
  fr: { translation: frTranslations },
};

export const initI18n = async () => {
  let savedLanguage =
    (await SessionStorage.getItemAsync(STORAGE_KEY.LANGUAGE)) ||
    "fr";

  i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage.split("-")[0], // Use the language part of the locale
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });
};

export const changeLanguage = async (language: string) => {
  await Promise.all([
    SessionStorage.setItemAsync(STORAGE_KEY.LANGUAGE, language),
    i18n.changeLanguage(language),
  ]);
};

export default i18n;
