import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import enTranslation from "./locales/en.json";
import viTranslation from "./locales/vi.json";

const initI18n = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem("language");
    const defaultLanguage = savedLanguage || "vi";

    i18n.use(initReactI18next).init({
      resources: {
        en: {
          translation: enTranslation,
        },
        vi: {
          translation: viTranslation,
        },
      },
      lng: defaultLanguage,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
    });
  } catch (error) {
    console.error("Error initializing i18n:", error);
    // Fallback to default configuration
    i18n.use(initReactI18next).init({
      resources: {
        en: {
          translation: enTranslation,
        },
        vi: {
          translation: viTranslation,
        },
      },
      lng: "vi",
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
    });
  }
};

initI18n();

export default i18n;
