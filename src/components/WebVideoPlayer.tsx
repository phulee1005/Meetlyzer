import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Text,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "constants/colors";
import { widthScale, heightScale, fontScale } from "utils/scale";
import { useTranslation } from "react-i18next";

const { height } = Dimensions.get("window");

interface WebVideoPlayerProps {
  uri: string;
  style?: any;
  onFullscreen?: () => void;
  onError?: (error: any) => void;
}

export default function WebVideoPlayer({
  uri,
  style,
  onFullscreen,
  onError,
}: WebVideoPlayerProps) {
  const { t } = useTranslation();
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const webViewRef = useRef<WebView>(null);

  // HTML template cho video player
  const createVideoHTML = (videoUrl: string) => `
    <html>
      <body style="margin:0;padding:0;overflow:hidden;background:black;">
            <video controls autoplay style="width:100%;height:100%;" playsinline>
                <source src="${videoUrl}" type="video/mp4">
                <source src="${videoUrl}" type="video/webm">
            Your browser does not support the video tag.
        </video>
      </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    // Đơn giản hóa - chỉ xử lý lỗi cơ bản
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "error") {
        setHasError(true);
        setErrorMessage(data.error || "Không thể phát video");
        onError?.(data.error);
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error);
    }
  };

  const handleFullscreen = () => {
    onFullscreen?.();
  };

  if (hasError) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle"
            size={fontScale(48)}
            color={Colors.error}
          />
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Text style={styles.errorSubtext}>
            {t("documentDetail.videoNotSupported")}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        source={{ html: createVideoHTML(uri) }}
        style={styles.webview}
        onMessage={handleMessage}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={false}
        scrollEnabled={false}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />

      {/* Loading Overlay - Đơn giản hóa */}
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color={Colors.white} />
        <Text style={styles.loadingText}>
          {t("documentDetail.videoLoading")}
        </Text>
      </View>

      {/* Fullscreen Button */}
      <TouchableOpacity
        style={styles.fullscreenButton}
        onPress={handleFullscreen}
      >
        <Ionicons name="expand" size={fontScale(24)} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: height * 0.4,
    backgroundColor: Colors.primaryText,
    borderRadius: widthScale(12),
    overflow: "hidden",
    position: "relative",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  loadingText: {
    color: Colors.white,
    fontSize: fontScale(16),
    marginTop: heightScale(12),
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: widthScale(20),
  },
  errorText: {
    color: Colors.error,
    fontSize: fontScale(16),
    fontWeight: "600",
    marginTop: heightScale(12),
    textAlign: "center",
  },
  errorSubtext: {
    color: Colors.secondaryText,
    fontSize: fontScale(14),
    marginTop: heightScale(8),
    textAlign: "center",
  },
  fullscreenButton: {
    position: "absolute",
    top: widthScale(16),
    right: widthScale(16),
    padding: widthScale(8),
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: widthScale(20),
  },
});
