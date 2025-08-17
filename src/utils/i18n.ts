import i18n from "../i18n";

// Utility function để lấy translation trong service
export const getTranslation = (key: string): string => {
  return i18n.t(key);
};

// Các key translation thường dùng
export const TRANSLATION_KEYS = {
  SESSION_EXPIRED: {
    TITLE: "error.sessionExpired.title",
    MESSAGE: "error.sessionExpired.message",
  },
} as const;
