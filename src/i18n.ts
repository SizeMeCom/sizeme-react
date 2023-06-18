import uiOptions from "./api/uiOptions";
import i18n from "i18next";
import en from "./i18n/en.json";
import fi from "./i18n/fi.json";
import sv from "./i18n/sv.json";
import ar from "./i18n/ar.json";
import de from "./i18n/de.json";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: en,
  },
  fi: {
    translation: fi,
  },
  sv: {
    translation: sv,
  },
  ar: {
    translation: ar,
  },
  de: {
    translation: de,
  },
} as const;

void i18n
  .use(initReactI18next)
  .init({
    lng: uiOptions.lang ?? document.documentElement.lang ?? "en",
    fallbackLng: "en",
    debug: false,
    resources,
  })
  .then(() => {
    i18n.services.formatter?.add("lowercase", (value: string) => value.toLowerCase());
    i18n.services.formatter?.add("capitalize", (value: string) => value.replace(/^(.)/, "\\u$1"));
  });

const additionalTranslations = window.sizeme_options?.additionalTranslations;
if (additionalTranslations) {
  ["en", "fi", "sv", "ar", "de"].forEach((lng) => {
    if (additionalTranslations[lng]) {
      i18n.addResourceBundle(lng, "translation", additionalTranslations[lng], true, true);
    }
  });
}

export default i18n;
