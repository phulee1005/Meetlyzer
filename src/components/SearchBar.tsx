import React, { useCallback, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { widthScale, heightScale, fontScale } from "utils/scale";
import { Colors } from "constants/colors";
import { useTranslation } from "react-i18next";
import { debounce } from "lodash";

interface SearchBarProps {
  onChangeText: (text: string) => void;
  placeholder?: string;
  showLabel?: boolean;
  rightComponent?: React.ReactNode;
  style?: any;
}

export default function SearchBar({
  onChangeText,
  placeholder,
  showLabel = true,
  rightComponent,
  style,
}: SearchBarProps) {
  const { t } = useTranslation();

  const debouncedSearch = useCallback(
    debounce((text: string) => {
      onChangeText(text);
    }, 500),
    []
  );

  return (
    <View style={[styles.container, style]}>
      {showLabel && <Text style={styles.label}>{t("home.search")}</Text>}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.secondaryText} />
        <TextInput
          style={styles.input}
          placeholder={placeholder || t("home.searchPlaceholder")}
          placeholderTextColor={Colors.placeholderText}
          onChangeText={debouncedSearch}
          returnKeyType="search"
        />
        {rightComponent && (
          <View style={styles.rightComponent}>{rightComponent}</View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: heightScale(10),
  },
  label: {
    fontSize: fontScale(16),
    fontWeight: "bold",
    color: Colors.primaryText,
    marginBottom: heightScale(8),
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: widthScale(12),
    paddingHorizontal: widthScale(16),
    paddingVertical: heightScale(12),
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  input: {
    flex: 1,
    marginLeft: widthScale(12),
    fontSize: fontScale(16),
    color: Colors.inputText,
  },
  rightComponent: {
    marginLeft: widthScale(8),
  },
});
