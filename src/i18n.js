/* global sizeme_options */

import uiOptions from "./api/uiOptions";
import i18n from "i18next";
import en from "./i18n/en.json";
import fi from "./i18n/fi.json";
import sv from "./i18n/sv.json";
import ar from "./i18n/ar.json";
import de from "./i18n/de.json";

i18n.init({
  lng: uiOptions.lang || document.documentElement.lang || "en",
  fallbackLng: "en",
  debug: false,
  interpolation: {
    format: (value, format) => {
      switch (format) {
        case "lowercase":
          return value.toLowerCase();

        case "capitalize":
          return value.replace(/^(.)/, "\\u$1");

        default:
          return value;
      }
    },
  },
  resources: {
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
  },
});

const additionalTranslations = window.sizeme_options ? sizeme_options.additionalTranslations : null;

if (additionalTranslations) {
  const addtr = additionalTranslations;
  ["en", "fi", "sv", "ar", "de"].forEach((lng) => {
    if (addtr[lng]) {
      i18n.addResourceBundle(lng, "translation", addtr[lng], true, true);
    }
  });
}

export default i18n;
