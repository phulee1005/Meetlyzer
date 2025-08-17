import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { fontScale, heightScale, widthScale } from "utils/scale";
import { Colors } from "constants/colors";
import LanguageSelector from "./LanguageSelector";

interface LanguageSectionProps {
  currentLanguage: string;
  onLanguageChange: (language: "vi" | "en") => void;
}

export default function LanguageSection({
  currentLanguage,
  onLanguageChange,
}: LanguageSectionProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("profile.language")}</Text>
      <View style={styles.selectorContainer}>
        <LanguageSelector
          currentLanguage={currentLanguage}
          onLanguageChange={onLanguageChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: widthScale(16),
    marginVertical: heightScale(8),
  },
  title: {
    fontSize: fontScale(16),
    fontWeight: "600",
    color: Colors.primaryText,
    marginBottom: heightScale(12),
  },
  selectorContainer: {
    alignItems: "center",
  },
});
