import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Colors } from "constants/colors";

interface RecordActionModalProps {
  visible: boolean;
  onClose: () => void;
  onCancel: () => void;
  onUpload: () => void;
  isUploading?: boolean;
}

const RecordActionModal: React.FC<RecordActionModalProps> = ({
  visible,
  onClose,
  onCancel,
  onUpload,
  isUploading = false,
}) => {
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
          <View style={styles.header}>
            <Ionicons
              name="checkmark-circle"
              size={60}
              color={Colors.success}
            />
            <Text style={styles.title}>{t("record.recordingComplete")}</Text>
            <Text style={styles.subtitle}>{t("record.chooseAction")}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={isUploading}
            >
              <Ionicons
                name="close-circle-outline"
                size={24}
                color={Colors.secondaryText}
              />
              <Text style={styles.cancelButtonText}>{t("record.cancel")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.uploadButton]}
              onPress={onUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <Ionicons
                  name="cloud-upload-outline"
                  size={24}
                  color={Colors.white}
                />
              ) : (
                <Ionicons name="cloud-upload" size={24} color={Colors.white} />
              )}
              <Text style={styles.uploadButtonText}>
                {isUploading ? t("record.uploading") : t("record.upload")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 40,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primaryText,
    marginTop: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondaryText,
    marginTop: 8,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 100,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  uploadButton: {
    backgroundColor: Colors.blue,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.secondaryText,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
  },
});

export default RecordActionModal;
