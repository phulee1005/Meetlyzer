import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Colors } from "constants/colors";
import { useRecordScreen } from "./useRecordScreen";
import { AudioWaveform, RecordActionModal, TitleHeader } from "components";
import { heightScale, widthScale } from "utils/scale";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "@navigation/type";

export default function RecordScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<RootStackNavigationProp>();

  const {
    recorderState,
    record,
    stopRecording,
    formattedDuration,
    showActionModal,
    isUploading,
    handleActionModalClose,
    handleCancelRecording,
    handleUploadRecording,
  } = useRecordScreen();

  const handleRecordPress = () => {
    if (recorderState.isRecording) {
      stopRecording();
    } else {
      record();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TitleHeader title={t("record.title")} />
      <View style={styles.center}>
        {recorderState.isRecording && (
          <Text style={styles.duration}>{formattedDuration}</Text>
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.visualizationContainer}>
          {recorderState.isRecording ? (
            <AudioWaveform />
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons
                name="mic-outline"
                size={80}
                color={Colors.secondaryText}
              />
              <Text style={styles.placeholderText}>
                {t("record.startRecording")}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[
              styles.recordButton,
              recorderState.isRecording && styles.recordButtonActive,
            ]}
            onPress={handleRecordPress}
            activeOpacity={0.8}
          >
            <Ionicons
              name={recorderState.isRecording ? "stop" : "mic"}
              size={40}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Action Modal */}
      <RecordActionModal
        visible={showActionModal}
        onClose={handleActionModalClose}
        onCancel={handleCancelRecording}
        onUpload={handleUploadRecording}
        isUploading={isUploading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: widthScale(20),
    paddingVertical: heightScale(16),
  },
  center: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primaryText,
  },
  duration: {
    fontSize: 18,
    color: Colors.blue,
    fontWeight: "600",
    marginTop: 5,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  visualizationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 40,
  },
  controlsContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.blue,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: Colors.blue,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  recordButtonActive: {
    backgroundColor: Colors.red,
    shadowColor: Colors.red,
  },
  backButton: {
    padding: widthScale(8),
  },
});
