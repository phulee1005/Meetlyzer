import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { fontScale, heightScale, widthScale } from "utils/scale";
import { Colors } from "constants/colors";
import LanguageSelector from "./LanguageSelector";

interface ProfileMenuItemProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
  showArrow?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  showLanguageSelector?: boolean;
  currentLanguage?: string;
  onLanguageChange?: (language: "vi" | "en") => void;
}

export default function ProfileMenuItem({
  title,
  subtitle,
  onPress,
  showArrow = true,
  showSwitch = false,
  switchValue = false,
  onSwitchChange,
  showLanguageSelector = false,
  currentLanguage,
  onLanguageChange,
}: ProfileMenuItemProps) {
  const handlePress = () => {
    if (showSwitch && onSwitchChange) {
      onSwitchChange(!switchValue);
    } else if (!showLanguageSelector) {
      onPress();
    }
  };

  const content = (
    <View style={styles.content}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {showSwitch && (
        <View style={styles.switchContainer}>
          <View style={[styles.switch, switchValue && styles.switchActive]}>
            <View
              style={[
                styles.switchThumb,
                switchValue && styles.switchThumbActive,
              ]}
            />
            <Text
              style={[
                styles.switchText,
                switchValue && styles.switchTextActive,
              ]}
            >
              {switchValue ? "EN" : "VI"}
            </Text>
          </View>
        </View>
      )}
      {showLanguageSelector && currentLanguage && onLanguageChange && (
        <View style={styles.languageSelectorContainer}>
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={onLanguageChange}
          />
        </View>
      )}
      {showArrow && !showSwitch && !showLanguageSelector && (
        <Text style={styles.arrow}>›</Text>
      )}
    </View>
  );

  if (showLanguageSelector) {
    return <View style={styles.container}>{content}</View>;
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    marginHorizontal: widthScale(16),
    marginVertical: heightScale(4),
    borderRadius: widthScale(12),
    paddingHorizontal: widthScale(16),
    paddingVertical: heightScale(16),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: fontScale(16),
    fontWeight: "600",
    color: Colors.primaryText,
    marginBottom: heightScale(2),
  },
  subtitle: {
    fontSize: fontScale(14),
    color: Colors.secondaryText,
  },
  arrow: {
    fontSize: fontScale(20),
    color: Colors.secondaryText,
    fontWeight: "300",
  },
  switchContainer: {
    marginLeft: widthScale(16),
  },
  switch: {
    width: widthScale(44),
    height: heightScale(24),
    backgroundColor: Colors.lightGray,
    borderRadius: widthScale(12),
    padding: widthScale(2),
    justifyContent: "center",
  },
  switchActive: {
    backgroundColor: Colors.blue,
  },
  switchThumb: {
    width: widthScale(20),
    height: heightScale(20),
    backgroundColor: Colors.white,
    borderRadius: widthScale(10),
    alignSelf: "flex-start",
  },
  switchThumbActive: {
    alignSelf: "flex-end",
  },
  switchText: {
    position: "absolute",
    fontSize: fontScale(10),
    fontWeight: "bold",
    color: Colors.secondaryText,
    left: widthScale(6),
    top: heightScale(2),
  },
  switchTextActive: {
    color: Colors.white,
    right: widthScale(6),
    left: "auto",
  },
  languageSelectorContainer: {
    marginLeft: widthScale(16),
  },
});
