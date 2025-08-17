import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useTranslation } from "react-i18next";
import { Colors } from "../constants/colors";
import { widthScale, heightScale, fontScale } from "../utils/scale";

const { width } = Dimensions.get("window");

interface UploadModalProps {
  visible: boolean;
  onClose: () => void;
  onUpload: (fileUri?: string, fileName?: string) => void;
  isUploading?: boolean;
  progress?: number;
  clearFileOnComplete?: boolean;
  onClearFile?: () => void;
  uploadSuccess?: boolean;
}

const UploadModal: React.FC<UploadModalProps> = ({
  visible,
  onClose,
  onUpload,
  isUploading = false,
  progress = 0,
  clearFileOnComplete = true,
  onClearFile,
  uploadSuccess = false,
}) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<{
    uri: string;
    name: string;
    size: number;
  } | null>(null);

  // Clear file when upload completes (progress reaches 100%)
  useEffect(() => {
    if (progress === 100 && !isUploading && clearFileOnComplete) {
      // Clear file after a short delay to show completion
      const timer = setTimeout(() => {
        setSelectedFile(null);
        onClearFile?.();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [progress, isUploading, clearFileOnComplete, onClearFile]);

  // Clear file when upload is successful and modal becomes invisible
  useEffect(() => {
    if (!visible && uploadSuccess && clearFileOnComplete) {
      // Clear file when modal is hidden after successful upload
      setSelectedFile(null);
      onClearFile?.();
    }
  }, [visible, uploadSuccess, clearFileOnComplete, onClearFile]);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        t("upload.permissionRequired"),
        t("upload.cameraRollPermission")
      );
      return false;
    }
    return true;
  };

  const handlePickFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
        videoMaxDuration: 300, // 5 minutes max
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        // Check file size (500MB limit)
        if (asset.fileSize && asset.fileSize > 500 * 1024 * 1024) {
          Alert.alert(t("upload.fileTooLarge"), t("upload.fileSizeLimit"));
          return;
        }

        setSelectedFile({
          uri: asset.uri,
          name: asset.fileName || `video_${Date.now()}.mp4`,
          size: asset.fileSize || 0,
        });
      }
    } catch (error) {
      console.error("Error picking from gallery:", error);
      Alert.alert(t("upload.error"), t("upload.errorPickingGallery"));
    }
  };

  const handlePickFromFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["video/*"],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];

      // Check file size (500MB limit)
      if (file.size && file.size > 500 * 1024 * 1024) {
        Alert.alert(t("upload.fileTooLarge"), t("upload.fileSizeLimit"));
        return;
      }

      setSelectedFile({
        uri: file.uri,
        name: file.name,
        size: file.size || 0,
      });
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert(t("upload.error"), t("upload.errorPickingFile"));
    }
  };

  const handleFilePick = () => {
    Alert.alert(t("upload.selectVideoSource"), t("upload.chooseVideoSource"), [
      {
        text: t("upload.photoGallery"),
        onPress: handlePickFromGallery,
      },
      {
        text: t("upload.files"),
        onPress: handlePickFromFiles,
      },
      {
        text: t("upload.cancel"),
        style: "cancel",
      },
    ]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert(t("upload.noFileSelected"), t("upload.pleaseSelectFile"));
      return;
    }

    // Call onUpload with file info
    onUpload(selectedFile.uri, selectedFile.name);
  };

  const handleClose = () => {
    // Only clear file if upload was not successful
    if (!uploadSuccess) {
      setSelectedFile(null);
      onClearFile?.();
    }
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>{t("upload.title")}</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}
                >
                  <Ionicons
                    name="close"
                    size={fontScale(24)}
                    color={Colors.primaryText}
                  />
                </TouchableOpacity>
              </View>

              {/* Upload Area */}
              <View style={styles.uploadArea}>
                {selectedFile ? (
                  <View style={styles.selectedFileContainer}>
                    <Ionicons
                      name="videocam"
                      size={fontScale(32)}
                      color={Colors.primaryButton}
                    />
                    <Text style={styles.fileName}>{selectedFile.name}</Text>
                    <Text style={styles.fileSize}>
                      {formatFileSize(selectedFile.size)}
                    </Text>
                    <TouchableOpacity
                      style={styles.changeFileButton}
                      onPress={handleFilePick}
                    >
                      <Text style={styles.changeFileText}>
                        {t("upload.changeFile")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={handleFilePick}
                  >
                    <Ionicons
                      name="cloud-upload-outline"
                      size={fontScale(48)}
                      color={Colors.primaryButton}
                    />
                    <Text style={styles.uploadText}>
                      {t("upload.tapToUpload")}
                    </Text>
                    <Text style={styles.uploadSubtext}>
                      {t("upload.fromGalleryOrFiles")}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Progress Bar */}
              {isUploading && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[styles.progressFill, { width: `${progress}%` }]}
                    />
                  </View>
                  <Text style={styles.progressText}>{progress}%</Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleClose}
                >
                  <Text style={styles.cancelButtonText}>
                    {t("upload.cancel")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.uploadActionButton,
                    (!selectedFile || isUploading) && styles.uploadingButton,
                  ]}
                  onPress={handleUpload}
                  disabled={!selectedFile || isUploading}
                >
                  <Text style={styles.uploadActionButtonText}>
                    {isUploading ? t("upload.uploading") : t("upload.upload")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
    width: width * 0.9,
    maxWidth: widthScale(400),
    backgroundColor: Colors.white,
    borderRadius: widthScale(16),
    padding: widthScale(20),
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: heightScale(20),
  },
  title: {
    fontSize: fontScale(20),
    fontWeight: "600",
    color: Colors.primaryText,
  },
  closeButton: {
    padding: widthScale(5),
  },
  uploadArea: {
    marginBottom: heightScale(24),
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: "dashed",
    borderRadius: widthScale(12),
    padding: widthScale(40),
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  selectedFileContainer: {
    borderWidth: 2,
    borderColor: Colors.primaryButton,
    borderRadius: widthScale(12),
    padding: widthScale(20),
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  fileName: {
    fontSize: fontScale(16),
    fontWeight: "500",
    color: Colors.primaryText,
    marginTop: heightScale(12),
    marginBottom: heightScale(4),
    textAlign: "center",
  },
  fileSize: {
    fontSize: fontScale(14),
    color: Colors.secondaryText,
    marginBottom: heightScale(12),
  },
  changeFileButton: {
    paddingHorizontal: widthScale(16),
    paddingVertical: heightScale(8),
    borderRadius: widthScale(6),
    backgroundColor: Colors.primaryButton,
    borderWidth: 1,
    borderColor: Colors.primaryButton,
  },
  changeFileText: {
    fontSize: fontScale(14),
    color: Colors.primaryText,
    fontWeight: "500",
  },
  progressContainer: {
    marginBottom: heightScale(24),
  },
  progressBar: {
    height: heightScale(8),
    backgroundColor: Colors.border,
    borderRadius: widthScale(4),
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primaryButton,
    borderRadius: widthScale(4),
  },
  progressText: {
    fontSize: fontScale(14),
    color: Colors.secondaryText,
    textAlign: "center",
    marginTop: heightScale(8),
  },
  uploadText: {
    fontSize: fontScale(16),
    fontWeight: "500",
    color: Colors.primaryText,
    marginTop: heightScale(12),
    marginBottom: heightScale(4),
  },
  uploadSubtext: {
    fontSize: fontScale(14),
    color: Colors.secondaryText,
  },
  actionButtons: {
    flexDirection: "row",
    gap: widthScale(12),
  },
  cancelButton: {
    flex: 1,
    padding: widthScale(16),
    borderRadius: widthScale(8),
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  cancelButtonText: {
    fontSize: fontScale(16),
    color: Colors.primaryText,
    fontWeight: "500",
  },
  uploadActionButton: {
    flex: 1,
    padding: widthScale(16),
    borderRadius: widthScale(8),
    backgroundColor: Colors.primaryText,
    alignItems: "center",
  },
  uploadingButton: {
    backgroundColor: Colors.secondaryText,
  },
  uploadActionButtonText: {
    fontSize: fontScale(16),
    color: Colors.white,
    fontWeight: "500",
  },
});

export default UploadModal;
