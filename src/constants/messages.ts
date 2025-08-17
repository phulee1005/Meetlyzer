export const Messages = {
  VALIDATION: {
    EMAIL_REQUIRED: "validation.emailRequired",
    EMAIL_INVALID: "validation.emailInvalid",
    PASSWORD_REQUIRED: "validation.passwordRequired",
    PASSWORD_MIN_LENGTH: "validation.passwordMinLength",
    NAME_REQUIRED: "validation.nameRequired",
    NAME_MIN_LENGTH: "validation.nameMinLength",
    PHONE_REQUIRED: "validation.phoneRequired",
    PHONE_INVALID: "validation.phoneInvalid",
  },
  ERROR: {
    NETWORK_FAILED: "error.networkFailed",
    NETWORK_TIMEOUT: "error.networkTimeout",
    LOGIN_FAILED: "error.loginFailed",
    GOOGLE_LOGIN_FAILED: "error.googleLoginFailed",
    SERVER_ERROR: "error.serverError",
    UNKNOWN_ERROR: "error.unknownError",
  },
  SUCCESS: {
    LOGIN_SUCCESS: "success.loginSuccess",
  },
} as const;
