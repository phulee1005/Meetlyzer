export const Colors = {
  // Background colors
  background: "#FDF3EC",
  white: "#FFF",

  // Text colors
  primaryText: "#6B4F3B",
  secondaryText: "#B0A9A2",
  inputText: "#333",
  placeholderText: "#aaa",

  // Border colors
  border: "#CFCFCF",

  // Button colors
  primaryButton: "#FADFCB",
  primaryButtonText: "#6B4F3B",

  // Link colors
  link: "#F2994A",

  // Social button colors
  google: "#EA4335",
  facebook: "#1877F3",
  apple: "#000",

  // Icon colors
  icon: "#aaa",

  // Error colors
  error: "#FF6B6B",
  errorBackground: "#FFE6E6",
  errorBorder: "#FF6B6B",

  // Success colors
  success: "#4CAF50",
  successBackground: "#E8F5E8",
  successBorder: "#4CAF50",

  // New colors for HomeScreen
  blue: "#4A90E2",
  lightBlue: "#E3F2FD",
  darkBlue: "#1976D2",
  orange: "#FF9800",
  red: "#FF5252",
  lightGray: "#F5F5F5",
  darkGray: "#757575",
  cardShadow: "rgba(0, 0, 0, 0.1)",
  statusBarText: "#000",
} as const;

export type ColorType = keyof typeof Colors;
