import React, { useState, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fontScale, widthScale, heightScale } from "utils/scale";
import { Colors } from "constants/colors";
import { useTranslation } from "react-i18next";
import CustomTextInput from "./TextInput";
import { useKeyboardAnimation } from "hooks/useKeyboardAnimation";
import { validateMeetingLink } from "utils/validate";

const { width } = Dimensions.get("window");

interface JoinLiveModalProps {
  visible: boolean;
  onClose: () => void;
  onJoin: (url: string, language: Language) => void;
  onReset?: () => void;
  isLoading?: boolean;
}

export type Language = "vi" | "en";

const JoinLiveModal: React.FC<JoinLiveModalProps> = ({
  visible,
  onClose,
  onJoin,
  onReset,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("vi");
  const [urlError, setUrlError] = useState<string | null>(null);

  const scaleValue = React.useRef(new Animated.Value(0)).current;
  const opacityValue = React.useRef(new Animated.Value(0)).current;

  const { contentTranslateY, handleInputFocus, handleInputBlur } =
    useKeyboardAnimation({
      contentTranslateYValue: -heightScale(100),
      animationDuration: 300,
    });

  React.useEffect(() => {
    if (visible) {
      handleInputBlur();
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleJoin = useCallback(() => {
    if (!url.trim()) {
      Alert.alert("Error", t("home.joinLiveModal.urlRequired"));
      return;
    }

    if (!selectedLanguage) {
      Alert.alert("Error", t("home.joinLiveModal.languageRequired"));
      return;
    }

    // Kiểm tra lỗi validation
    if (urlError) {
      Alert.alert("Error", urlError);
      return;
    }

    // Không reset form khi đang loading, chỉ gọi onJoin
    onJoin(url.trim(), selectedLanguage);
  }, [url, selectedLanguage, urlError, onJoin, t]);

  const handleClose = useCallback(() => {
    setUrl("");
    setUrlError(null);
    handleInputBlur();
    setSelectedLanguage("vi");
    onClose();
  }, [onClose]);

  // Reset form khi modal được đóng
  React.useEffect(() => {
    if (!visible && onReset) {
      setUrl("");
      setUrlError(null);
      setSelectedLanguage("vi");
    }
  }, [visible, onReset]);

  const handleLanguageSelect = useCallback((language: Language) => {
    setSelectedLanguage(language);
  }, []);

  const handleUrlChange = useCallback(
    (text: string) => {
      setUrl(text);
      setUrlError(null); // Clear error when user types

      // Real-time validation
      if (text.trim()) {
        const validationResult = validateMeetingLink(text.trim());
        if (!validationResult.validate) {
          setUrlError(t("home.joinLiveModal.invalidUrl"));
        } else {
          const supportedPlatforms = ["google", "zoom", "mst"];
          if (!supportedPlatforms.includes(validationResult.platform || "")) {
            setUrlError(t("home.joinLiveModal.unsupportedPlatform"));
          }
        }
      }
    },
    [t]
  );

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: opacityValue,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={() => {
            handleInputBlur();
          }}
        />
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                { scale: scaleValue },
                { translateY: contentTranslateY },
              ],
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{t("home.joinLiveModal.title")}</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons
                name="close"
                size={fontScale(24)}
                color={Colors.secondaryText}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <CustomTextInput
              placeholder={t("home.joinLiveModal.urlPlaceholder")}
              value={url}
              onChangeText={handleUrlChange}
              leftIcon="link"
              keyboardType="default"
              autoCapitalize="none"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              editable={!isLoading}
              containerStyle={[
                styles.urlInput,
                urlError && styles.urlInputError,
                isLoading && styles.disabledInput,
              ]}
            />
            {urlError && <Text style={styles.errorText}>{urlError}</Text>}

            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.primaryButton} />
                <Text style={styles.loadingText}>
                  {t("home.joinLiveModal.connecting")}
                </Text>
              </View>
            )}

            <Text style={styles.languageLabel}>
              {t("home.joinLiveModal.languageLabel")}
            </Text>

            <View style={styles.languageContainer}>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  selectedLanguage === "vi" && styles.selectedLanguage,
                  isLoading && styles.disabledInput,
                ]}
                onPress={() => handleLanguageSelect("vi")}
                disabled={isLoading}
              >
                <Ionicons
                  name={
                    selectedLanguage === "vi"
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={fontScale(20)}
                  color={
                    selectedLanguage === "vi"
                      ? Colors.primaryButton
                      : Colors.secondaryText
                  }
                />
                <Text
                  style={[
                    styles.languageText,
                    selectedLanguage === "vi" && styles.selectedLanguageText,
                  ]}
                >
                  {t("home.joinLiveModal.vietnamese")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.languageOption,
                  selectedLanguage === "en" && styles.selectedLanguage,
                  isLoading && styles.disabledInput,
                ]}
                onPress={() => handleLanguageSelect("en")}
                disabled={isLoading}
              >
                <Ionicons
                  name={
                    selectedLanguage === "en"
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={fontScale(20)}
                  color={
                    selectedLanguage === "en"
                      ? Colors.primaryButton
                      : Colors.secondaryText
                  }
                />
                <Text
                  style={[
                    styles.languageText,
                    selectedLanguage === "en" && styles.selectedLanguageText,
                  ]}
                >
                  {t("home.joinLiveModal.english")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelBtn]}
              onPress={handleClose}
            >
              <Text style={styles.cancelBtnText}>
                {t("home.joinLiveModal.cancelButton")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.joinBtn,
                isLoading && styles.disabledBtn,
              ]}
              onPress={handleJoin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.joinBtnText}>
                  {t("home.joinLiveModal.joinButton")}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  overlayTouchable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: Colors.white,
    borderRadius: widthScale(16),
    padding: widthScale(20),
    elevation: 5,
    shadowColor: Colors.primaryText,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10000,
    maxHeight: "80%", // Giới hạn chiều cao để tránh modal quá cao
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: heightScale(20),
  },
  title: {
    fontSize: fontScale(18),
    fontWeight: "bold",
    color: Colors.primaryText,
    flex: 1,
  },
  closeButton: {
    padding: widthScale(4),
  },
  content: {
    marginBottom: heightScale(24),
  },
  languageLabel: {
    fontSize: fontScale(16),
    fontWeight: "600",
    color: Colors.primaryText,
    marginBottom: heightScale(12),
  },
  languageContainer: {
    gap: heightScale(12),
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: heightScale(12),
    paddingHorizontal: widthScale(16),
    borderRadius: widthScale(8),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedLanguage: {
    borderColor: Colors.primaryButton,
    backgroundColor: Colors.primaryButton + "10",
  },
  languageText: {
    fontSize: fontScale(16),
    color: Colors.secondaryText,
    marginLeft: widthScale(12),
  },
  selectedLanguageText: {
    color: Colors.primaryText,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: widthScale(12),
  },
  button: {
    paddingVertical: heightScale(12),
    paddingHorizontal: widthScale(24),
    borderRadius: widthScale(8),
    minWidth: widthScale(90),
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtn: {
    backgroundColor: Colors.errorBackground,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  joinBtn: {
    backgroundColor: Colors.primaryButton,
  },
  cancelBtnText: {
    color: Colors.error,
    fontSize: fontScale(16),
    fontWeight: "600",
  },
  joinBtnText: {
    color: Colors.primaryText,
    fontSize: fontScale(16),
    fontWeight: "600",
  },
  urlInput: {
    width: "100%",
    marginBottom: heightScale(16),
  },
  urlInputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: fontScale(14),
    marginBottom: heightScale(12),
    marginLeft: widthScale(4),
  },
  disabledBtn: {
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: heightScale(12),
    marginBottom: heightScale(16),
  },
  loadingText: {
    fontSize: fontScale(14),
    color: Colors.primaryButton,
    marginLeft: widthScale(8),
  },
  disabledInput: {
    opacity: 0.6,
  },
});

export default JoinLiveModal;
