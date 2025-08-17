import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "constants/colors";
import { widthScale, heightScale, fontScale } from "utils/scale";

interface TranslationLoadingOverlayProps {
  isVisible: boolean;
  onBackPress?: () => void;
}

export default function TranslationLoadingOverlay({
  isVisible,
  onBackPress,
}: TranslationLoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackPress}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={fontScale(24)} color={Colors.white} />
      </TouchableOpacity>

      {/* Loading content */}
      <View style={styles.content}>
        <ActivityIndicator
          size="large"
          color={Colors.white}
          style={styles.spinner}
        />

        <Text style={styles.title}>Đang phân tích dữ liệu</Text>

        <Text style={styles.subtitle}>
          Dữ liệu đang được phân tích, vui lòng đợi trong giây lát
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: heightScale(60),
    left: widthScale(20),
    zIndex: 1001,
    padding: widthScale(8),
  },
  content: {
    alignItems: "center",
    paddingHorizontal: widthScale(40),
  },
  spinner: {
    marginBottom: heightScale(24),
  },
  title: {
    fontSize: fontScale(20),
    fontWeight: "600",
    color: Colors.white,
    textAlign: "center",
    marginBottom: heightScale(12),
  },
  subtitle: {
    fontSize: fontScale(16),
    color: Colors.white,
    textAlign: "center",
    lineHeight: fontScale(24),
    opacity: 0.8,
  },
});
