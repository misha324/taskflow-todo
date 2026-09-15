import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ur from "./locales/ur.json";


// ==========================================
// SAVED LANGUAGE
// ==========================================

const savedLanguage =
  localStorage.getItem("language") || "en";


// ==========================================
// i18n CONFIGURATION
// ==========================================

i18n
  .use(initReactI18next)
  .init({

    resources: {

      en: {
        translation: en,
      },

      ur: {
        translation: ur,
      },

    },

    lng: savedLanguage,

    fallbackLng: "en",

    interpolation: {
      escapeValue: false,
    },

  });


// ==========================================
// LANGUAGE CHANGE
// ==========================================

i18n.on(
  "languageChanged",
  (language) => {

    // Save language
    localStorage.setItem(
      "language",
      language
    );


    // HTML language
    document.documentElement.lang =
      language;


    // RTL / LTR
    document.documentElement.dir =
      language === "ur"
        ? "rtl"
        : "ltr";

  }
);


// ==========================================
// INITIAL LANGUAGE
// ==========================================

document.documentElement.lang =
  savedLanguage;

document.documentElement.dir =
  savedLanguage === "ur"
    ? "rtl"
    : "ltr";


export default i18n;