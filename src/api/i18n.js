import uiOptions from "./uiOptions";
import en from "./i18n/en";
import fi from "./i18n/en";
import sv from "./i18n/en";

const defaultLang = "en";
const sizemeLang = uiOptions.lang || document.documentElement.lang || "en";
const languages = {
    en, fi, sv
};

export default languages[sizemeLang] || languages[defaultLang];

export const getLang = lang => languages[lang] || languages[defaultLang];
