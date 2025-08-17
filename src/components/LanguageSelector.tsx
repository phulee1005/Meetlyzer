import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { fontScale, heightScale, widthScale } from "utils/scale";
import { Colors } from "constants/colors";

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: "vi" | "en") => void;
}

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.segment,
          currentLanguage === "vi" && styles.segmentActive,
        ]}
        onPress={() => onLanguageChange("vi")}
      >
        <Text
          style={[
            styles.segmentText,
            currentLanguage === "vi" && styles.segmentTextActive,
          ]}
        >
          VI
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.segment,
          currentLanguage === "en" && styles.segmentActive,
        ]}
        onPress={() => onLanguageChange("en")}
      >
        <Text
          style={[
            styles.segmentText,
            currentLanguage === "en" && styles.segmentTextActive,
          ]}
        >
          EN
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.lightGray,
    borderRadius: widthScale(8),
    padding: widthScale(2),
    width: widthScale(80),
    height: heightScale(32),
  },
  segment: {
    flex: 1,
    borderRadius: widthScale(6),
    justifyContent: "center",
    alignItems: "center",
  },
  segmentActive: {
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: fontScale(12),
    fontWeight: "600",
    color: Colors.secondaryText,
  },
  segmentTextActive: {
    color: Colors.primaryText,
  },
});
