import { sizemeOptions, uiOptions } from "../api/options"
import i18n from "i18next"
import en from "./en.json"
import fi from "./fi.json"
import sv from "./sv.json"
import ar from "./ar.json"

// noinspection JSIgnoredPromiseFromCall
i18n.init({
    lng: uiOptions.lang || document.documentElement.lang || "en",
    fallbackLng: "en",
    debug: false,
    interpolation: {
        format: (value, format) => {
            switch (format) {
                case "lowercase":
                    return value.toLowerCase()

                case "capitalize":
                    return value.replace(/^(.)/, "\\u$1")

                default:
                    return value
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
        },
        ar: {
            translation: ar
        }
    }
})

const additionalTranslations = sizemeOptions.additionalTranslations

if (additionalTranslations) {
    ;["en", "fi", "sv", "ar"].forEach((lng) => {
        if (additionalTranslations[lng]) {
            i18n.addResourceBundle(lng, "translation", additionalTranslations[lng], true, true)
        }
    })
}

export default i18n
