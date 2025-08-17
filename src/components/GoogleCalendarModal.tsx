import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { widthScale, heightScale, fontScale } from "utils/scale";
import { Colors } from "constants/colors";
import { useTranslation } from "react-i18next";

interface GoogleCalendarModalProps {
  visible: boolean;
  onClose: () => void;
  isRegistered: boolean;
  isLoading: boolean;
  onToggleRegistration: () => void;
}

export default function GoogleCalendarModal({
  visible,
  onClose,
  isRegistered,
  isLoading,
  onToggleRegistration,
}: GoogleCalendarModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t("home.googleCalendar.title")}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.primaryText} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Status Icon */}
            <View
              style={[styles.statusIcon, isRegistered && styles.registeredIcon]}
            >
              <Ionicons
                name={isRegistered ? "checkmark-circle" : "calendar-outline"}
                size={60}
                color={isRegistered ? Colors.success : Colors.primaryText}
              />
            </View>

            {/* Status Text */}
            <Text style={styles.statusTitle}>
              {isRegistered
                ? t("home.googleCalendar.connected")
                : t("home.googleCalendar.notConnected")}
            </Text>
            <Text style={styles.statusDescription}>
              {isRegistered
                ? t("home.googleCalendar.connectedDescription")
                : t("home.googleCalendar.notConnectedDescription")}
            </Text>

            {/* Action Button */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                isRegistered ? styles.disconnectButton : styles.connectButton,
                isLoading && styles.disabledButton,
              ]}
              onPress={onToggleRegistration}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={isRegistered ? Colors.error : Colors.white}
                />
              ) : (
                <Ionicons
                  name={isRegistered ? "close-circle" : "add-circle"}
                  size={20}
                  color={isRegistered ? Colors.error : Colors.white}
                />
              )}
              <Text
                style={[
                  styles.actionButtonText,
                  isRegistered
                    ? styles.disconnectButtonText
                    : styles.connectButtonText,
                ]}
              >
                {isLoading
                  ? t("home.googleCalendar.processing")
                  : isRegistered
                  ? t("home.googleCalendar.disconnect")
                  : t("home.googleCalendar.connect")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t("home.googleCalendar.footer")}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: Colors.background,
    borderRadius: widthScale(16),
    width: widthScale(320),
    maxWidth: "90%",
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: widthScale(20),
    paddingTop: heightScale(20),
    paddingBottom: heightScale(10),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  title: {
    fontSize: fontScale(18),
    fontWeight: "600",
    color: Colors.primaryText,
  },
  closeButton: {
    padding: widthScale(4),
  },
  content: {
    paddingHorizontal: widthScale(20),
    paddingVertical: heightScale(20),
    alignItems: "center",
  },
  statusIcon: {
    marginBottom: heightScale(16),
    padding: widthScale(16),
    borderRadius: widthScale(40),
    backgroundColor: Colors.lightGray,
  },
  registeredIcon: {
    backgroundColor: Colors.successBackground,
  },
  statusTitle: {
    fontSize: fontScale(20),
    fontWeight: "600",
    color: Colors.primaryText,
    textAlign: "center",
    marginBottom: heightScale(8),
  },
  statusDescription: {
    fontSize: fontScale(14),
    color: Colors.secondaryText,
    textAlign: "center",
    lineHeight: fontScale(20),
    marginBottom: heightScale(24),
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: widthScale(24),
    paddingVertical: heightScale(12),
    borderRadius: widthScale(8),
    minWidth: widthScale(160),
  },
  connectButton: {
    backgroundColor: Colors.primaryButton,
  },
  disconnectButton: {
    backgroundColor: Colors.errorBackground,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  disabledButton: {
    opacity: 0.6,
  },
  actionButtonText: {
    fontSize: fontScale(16),
    fontWeight: "600",
    marginLeft: widthScale(8),
  },
  connectButtonText: {
    color: Colors.white,
  },
  disconnectButtonText: {
    color: Colors.error,
  },
  footer: {
    paddingHorizontal: widthScale(20),
    paddingBottom: heightScale(20),
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingTop: heightScale(16),
  },
  footerText: {
    fontSize: fontScale(12),
    color: Colors.secondaryText,
    textAlign: "center",
    lineHeight: fontScale(16),
  },
});
