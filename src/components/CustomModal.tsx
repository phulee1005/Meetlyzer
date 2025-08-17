import React, { useState, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fontScale, widthScale, heightScale } from "utils/scale";
import { Colors } from "constants/colors";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

interface ModalConfig {
  title?: string;
  message: string;
  confirmText?: string;
  closeText?: string;
  onConfirm?: () => void;
  onClose?: () => void;
}

// Hook tích hợp trong component
const useModalInternal = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<ModalConfig>({
    message: "",
  });

  const showModal = useCallback((modalConfig: ModalConfig) => {
    setConfig(modalConfig);
    setVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setVisible(false);
  }, []);

  const showSuccess = useCallback(
    (message: string, title?: string, onConfirm?: () => void) => {
      showModal({
        title: title || t("modal.success"),
        message,
        confirmText: t("modal.ok"),
        closeText: t("modal.close"),
        onConfirm: () => {
          hideModal();
          onConfirm?.();
        },
        onClose: hideModal,
      });
    },
    [showModal, hideModal, t]
  );

  const showError = useCallback(
    (message: string, title?: string, onConfirm?: () => void) => {
      showModal({
        title: title || t("modal.error"),
        message,
        confirmText: t("modal.retry"),
        closeText: t("modal.close"),
        onConfirm: () => {
          hideModal();
          onConfirm?.();
        },
        onClose: hideModal,
      });
    },
    [showModal, hideModal, t]
  );

  const showInfo = useCallback(
    (message: string, title?: string, onConfirm?: () => void) => {
      showModal({
        title: title || t("modal.info"),
        message,
        confirmText: t("modal.ok"),
        onConfirm: () => {
          hideModal();
          onConfirm?.();
        },
        onClose: hideModal,
      });
    },
    [showModal, hideModal, t]
  );

  const showConfirm = useCallback(
    (
      message: string,
      title?: string,
      onConfirm?: () => void,
      onCancel?: () => void
    ) => {
      showModal({
        title: title || t("modal.confirm"),
        message,
        confirmText: t("modal.confirm"),
        closeText: t("modal.cancel"),
        onConfirm: () => {
          hideModal();
          onConfirm?.();
        },
        onClose: () => {
          hideModal();
          onCancel?.();
        },
      });
    },
    [showModal, hideModal, t]
  );

  return {
    visible,
    config,
    showSuccess,
    showError,
    showInfo,
    showConfirm,
  };
};

// Global instance để export
let modalInstance: ReturnType<typeof useModalInternal> | null = null;

const CustomModal: React.FC = () => {
  const { t } = useTranslation();
  const modal = useModalInternal();

  // Lưu instance để export
  React.useEffect(() => {
    modalInstance = modal;
  }, []);

  const scaleValue = React.useRef(new Animated.Value(0)).current;
  const opacityValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (modal.visible) {
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
  }, [modal.visible]);

  if (!modal.visible) return null;

  return (
    <Modal
      transparent
      visible={modal.visible}
      animationType="none"
      onRequestClose={modal.config.onClose}
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
          onPress={modal.config.onClose}
        />
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              {modal.config.title || t("modal.notification")}
            </Text>
            <TouchableOpacity
              onPress={modal.config.onClose}
              style={styles.closeButton}
            >
              <Ionicons
                name="close"
                size={fontScale(24)}
                color={Colors.secondaryText}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.message}>{modal.config.message}</Text>

          <View style={styles.buttonContainer}>
            {modal.config.closeText && (
              <TouchableOpacity
                style={[styles.button, styles.closeBtn]}
                onPress={modal.config.onClose}
              >
                <Text style={styles.closeBtnText}>
                  {modal.config.closeText}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.confirmBtn]}
              onPress={modal.config.onConfirm}
            >
              <Text style={styles.confirmBtnText}>
                {modal.config.confirmText || t("modal.ok")}
              </Text>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: heightScale(16),
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
  message: {
    fontSize: fontScale(16),
    color: Colors.secondaryText,
    lineHeight: fontScale(24),
    marginBottom: heightScale(24),
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
  closeBtn: {
    backgroundColor: Colors.errorBackground,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  confirmBtn: {
    backgroundColor: Colors.primaryButton,
  },
  closeBtnText: {
    color: Colors.error,
    fontSize: fontScale(16),
    fontWeight: "600",
  },
  confirmBtnText: {
    color: Colors.primaryText,
    fontSize: fontScale(16),
    fontWeight: "600",
  },
});

// Export các method để sử dụng từ bên ngoài
export const showSuccess = (
  message: string,
  title?: string,
  onConfirm?: () => void
) => {
  modalInstance?.showSuccess(message, title, onConfirm);
};

export const showError = (
  message: string,
  title?: string,
  onConfirm?: () => void
) => {
  modalInstance?.showError(message, title, onConfirm);
};

export const showInfo = (
  message: string,
  title?: string,
  onConfirm?: () => void
) => {
  modalInstance?.showInfo(message, title, onConfirm);
};

export const showConfirm = (
  message: string,
  title?: string,
  onConfirm?: () => void,
  onCancel?: () => void
) => {
  modalInstance?.showConfirm(message, title, onConfirm, onCancel);
};

export default CustomModal;
