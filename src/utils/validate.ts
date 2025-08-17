import { Messages } from "constants/messages";
import { PLATFORM } from "types/record";

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Validation với i18n messages
export const createValidationWithMessages = (t: (key: string) => string) => {
  const validateEmailWithMessage = (email: string): string | null => {
    if (!validateRequired(email)) {
      return t(Messages.VALIDATION.EMAIL_REQUIRED);
    }
    if (!validateEmail(email)) {
      return t(Messages.VALIDATION.EMAIL_INVALID);
    }
    return null;
  };

  const validatePasswordWithMessage = (password: string): string | null => {
    if (!validateRequired(password)) {
      return t(Messages.VALIDATION.PASSWORD_REQUIRED);
    }
    if (!validatePassword(password)) {
      return t(Messages.VALIDATION.PASSWORD_MIN_LENGTH);
    }
    return null;
  };

  const validateNameWithMessage = (name: string): string | null => {
    if (!validateRequired(name)) {
      return t("validation.nameRequired");
    }
    if (!validateName(name)) {
      return t("validation.nameMinLength");
    }
    return null;
  };

  const validatePhoneWithMessage = (phone: string): string | null => {
    if (!validateRequired(phone)) {
      return t("validation.phoneRequired");
    }
    if (!validatePhone(phone)) {
      return t("validation.phoneInvalid");
    }
    return null;
  };

  const validateLoginForm = (
    email: string,
    password: string
  ): string | null => {
    const emailError = validateEmailWithMessage(email);
    if (emailError) return emailError;

    const passwordError = validatePasswordWithMessage(password);
    if (passwordError) return passwordError;

    return null;
  };

  const validateRegisterForm = (
    name: string,
    email: string,
    password: string
  ): string | null => {
    const nameError = validateNameWithMessage(name);
    if (nameError) return nameError;

    const emailError = validateEmailWithMessage(email);
    if (emailError) return emailError;

    const passwordError = validatePasswordWithMessage(password);
    if (passwordError) return passwordError;

    return null;
  };

  return {
    validateEmail: validateEmailWithMessage,
    validatePassword: validatePasswordWithMessage,
    validateName: validateNameWithMessage,
    validatePhone: validatePhoneWithMessage,
    validateLoginForm,
    validateRegisterForm,
  };
};

export const validateMeetingLink = (text: string) => {
  const googleMeetRegex =
    /^https:\/\/meet\.google\.com\/([a-z]{3}-[a-z]{4}-[a-z]{3})(\?.+)?$/;

  const zoomRegex =
    /^https:\/\/([a-z0-9]+\.)?zoom\.us\/j\/(\d{9,11})(\?pwd=[A-Za-z0-9.\-]+)?$/;

  const teamsRegex =
    /^https:\/\/teams\.microsoft\.com\/l\/meetup-join\/([^\s?]+)(\?.+)?$/;

  const teamsLiveRegex =
    /^https:\/\/teams\.live\.com\/meet\/(\d+)(\?p=[A-Za-z0-9]+)?$/;

  // Check for Google Meet
  const googleMatch = text.match(googleMeetRegex);
  if (googleMatch) {
    return {
      validate: true,
      platform: PLATFORM.google,
      meetingCode: googleMatch[1],
      params: googleMatch[2]?.replace("?", "") || null,
    };
  }

  // Check for Zoom
  const zoomMatch = text.match(zoomRegex);
  if (zoomMatch) {
    return {
      validate: true,
      platform: PLATFORM.zoom,
      meetingCode: zoomMatch[2],
      params: zoomMatch[3]?.replace("?", "") || null,
    };
  }

  const teamsMatch = text.match(teamsRegex);
  if (teamsMatch) {
    return {
      validate: true,
      platform: PLATFORM.mst,
      meetingCode: teamsMatch[1],
      params: teamsMatch[2]?.replace("?", "") || null,
    };
  }

  const teamsLiveMatch = text.match(teamsLiveRegex);
  if (teamsLiveMatch) {
    return {
      validate: true,
      platform: PLATFORM.mst,
      meetingCode: teamsLiveMatch[1],
      params: teamsLiveMatch[2]?.replace("?", "") || null,
    };
  }

  return {
    validate: false,
    platform: null,
    meetingCode: null,
    params: null,
  };
};
