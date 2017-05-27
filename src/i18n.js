import uiOptions from "./api/uiOptions";
import i18n from "i18next";
import en from "./i18n/en.json";
import fi from "./i18n/fi.json";
import sv from "./i18n/sv.json";

i18n.init({
    lng: uiOptions.lang || document.documentElement.lang || "en",
    fallbackLng: "en",
    debug: true,
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
        }
    },
    resources: {
        en: {
            translation: en
        },
        fi: {
            translation: fi
        },
        sv: {
            translation: sv
        }
    }
});

export default i18n;
