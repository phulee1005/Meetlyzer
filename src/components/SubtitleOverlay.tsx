import React, { useState, useCallback, memo, Fragment } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "constants/colors";
import { widthScale, heightScale, fontScale } from "utils/scale";

interface SubtitleOverlayProps {
  content: string;
}

function SubtitleOverlay({ content }: SubtitleOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Memoize the toggle handler to prevent recreation on every render
  const handleToggle = useCallback(() => {
    setIsVisible((prev) => !prev);
  }, []);

  return (
    <View style={styles.container}>
      {/* Subtitle Content */}
      {isVisible ? (
        <Fragment>
          {content && (
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitleText}>{content}</Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleToggle}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="close"
                  size={fontScale(18)}
                  color={Colors.white}
                />
              </TouchableOpacity>
            </View>
          )}
        </Fragment>
      ) : (
        <TouchableOpacity style={styles.ccButton} onPress={handleToggle}>
          <Ionicons name="text" size={fontScale(30)} color={Colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
}

// Memoize the component to prevent re-renders when props haven't changed
export default memo(SubtitleOverlay);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: widthScale(16),
    left: widthScale(16),
    right: widthScale(16),
  },
  subtitleContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: widthScale(8),
    padding: widthScale(12),
    paddingRight: widthScale(28),
    position: "relative",
  },
  subtitleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: heightScale(4),
  },
  subtitleLabel: {
    color: Colors.white,
    fontSize: fontScale(12),
    fontWeight: "600",
    marginRight: widthScale(6),
  },
  subtitleText: {
    color: Colors.white,
    fontSize: fontScale(14),
    lineHeight: fontScale(20),
  },
  closeButton: {
    position: "absolute",
    top: widthScale(8),
    right: widthScale(4),
    width: widthScale(24),
    height: widthScale(24),
    alignItems: "center",
    justifyContent: "center",
  },
  ccButton: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: widthScale(6),
    paddingHorizontal: widthScale(8),
    paddingVertical: widthScale(4),
  },
  ccText: {
    color: Colors.white,
    fontSize: fontScale(12),
    fontWeight: "600",
  },
});
