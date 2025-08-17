import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { fontScale, heightScale, widthScale } from "utils/scale";
import { Colors } from "constants/colors";

export default function VersionInfo() {
  const { t } = useTranslation();

  const getVersion = () => {
    return "1.0.0"; // Có thể lấy từ package.json hoặc config
  };

  return (
    <View style={styles.container}>
      <Text style={styles.versionText}>
        {t("profile.version")} {getVersion()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: heightScale(20),
    marginTop: heightScale(20),
  },
  versionText: {
    fontSize: fontScale(12),
    color: Colors.secondaryText,
    opacity: 0.7,
  },
});
