import uiOptions from "./api/uiOptions";
import i18n from "i18next";
import en from "./i18n/en.json";
import fi from "./i18n/fi.json";
import sv from "./i18n/sv.json";
import ar from "./i18n/ar.json";
import de from "./i18n/de.json";
import es from "./i18n/es.json";
import et from "./i18n/et.json";
import fa from "./i18n/fa.json";
import ja from "./i18n/ja.json";

void i18n.init({
  lng: (uiOptions.lang || document.documentElement.lang || "en").split("-")[0],
  fallbackLng: "en",
  debug: false,
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
    es: {
      translation: es,
    },
    et: {
      translation: et,
    },
    fa: {
      translation: fa,
    },
    ja: {
      translation: ja,
    },
    jp: {
      translation: ja,
    },
  },
});

i18n.services.formatter.add("lowercase", (value) => value.toLowerCase());
i18n.services.formatter.add("capitalize", (value) => value.replace(/^(.)/, "\\u$1"));

const additionalTranslations = window.sizeme_options?.additionalTranslations;
if (additionalTranslations) {
  ["en", "fi", "sv", "ar", "de", "es", "et", "fa", "ja", "jp"].forEach((lng) => {
    if (additionalTranslations[lng]) {
      i18n.addResourceBundle(lng, "translation", additionalTranslations[lng], true, true);
    }
  });
}

export default i18n;
