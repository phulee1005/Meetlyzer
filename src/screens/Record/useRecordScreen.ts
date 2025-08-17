import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from "expo-audio";
import { useUploadMeetingMutation } from "services/uploadApi";
import { AppDispatch } from "@store/index";
import {
  resetUpload,
  setUploading,
  setSuccess,
  setError,
} from "@store/uploadSlice";
import { showSuccess } from "components/CustomModal";
import { RootStackNavigationProp } from "@navigation/type";

export const useRecordScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<RootStackNavigationProp>();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showActionModal, setShowActionModal] = useState(false);
  const [recordedFileUri, setRecordedFileUri] = useState<string>("");

  const [uploadMeeting, { isLoading: isUploading }] =
    useUploadMeetingMutation();

  const record = useCallback(async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
    } catch (error) {
      Alert.alert(t("record.error"), t("record.cannotStartRecording"));
    }
  }, [audioRecorder]);

  const stopRecording = useCallback(async () => {
    try {
      await audioRecorder.stop();
      setRecordedFileUri(audioRecorder.uri || "");
      setShowActionModal(true);
    } catch (error) {
      Alert.alert(t("record.error"), t("record.cannotStopRecording"));
    }
  }, [audioRecorder]);

  // Update recording duration
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (recorderState.isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [recorderState.isRecording]);

  // Format duration to MM:SS
  const formattedDuration = useCallback(() => {
    const minutes = Math.floor(recordingDuration / 60);
    const seconds = recordingDuration % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, [recordingDuration]);

  // Modal handlers
  const handleActionModalClose = useCallback(() => {
    setShowActionModal(false);
    setRecordedFileUri("");
    setRecordingDuration(0);
  }, []);

  const handleCancelRecording = useCallback(() => {
    setShowActionModal(false);
    setRecordedFileUri("");
    setRecordingDuration(0);
  }, []);

  const handleUploadRecording = useCallback(async () => {
    setShowActionModal(false);

    if (!recordedFileUri) {
      Alert.alert(t("record.error"), t("record.noFileSelected"));
      return;
    }

    try {
      // Create file object from URI
      const file = {
        uri: recordedFileUri,
        type: "audio/*",
        name: `recording_${Date.now()}.m4a`,
      };

      // Reset upload state
      dispatch(resetUpload());
      dispatch(setUploading(true));

      // Upload using RTK Query (without language parameter)
      const result = await uploadMeeting({ file }).unwrap();
      dispatch(setSuccess(true));

      if (result.response?._id) {
        showSuccess(t("home.uploadSuccess"), t("home.success"), () => {
          navigation.navigate("DocumentDetail", {
            id: result?.response?._id as string,
          });
        });
      }

      // Reset recording state
      setRecordedFileUri("");
      setRecordingDuration(0);
    } catch (error: any) {
      dispatch(setError(error.message || "Upload failed"));
      Alert.alert(t("record.error"), error.message || t("record.uploadFailed"));
    } finally {
      dispatch(setUploading(false));
    }
  }, [recordedFileUri, dispatch, uploadMeeting, navigation, t]);

  // Request permissions and setup audio mode
  useEffect(() => {
    const setupAudio = async () => {
      try {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (!status.granted) {
          Alert.alert(
            t("record.permissionRequired"),
            t("record.microphonePermission")
          );
          return;
        }

        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: true,
        });
      } catch (error) {
        Alert.alert(t("record.error"), t("record.cannotSetupAudio"));
      }
    };

    setupAudio();
  }, []);

  return {
    recorderState,
    record,
    stopRecording,
    recordingDuration,
    formattedDuration: formattedDuration(),
    showActionModal,
    isUploading,
    handleActionModalClose,
    handleCancelRecording,
    handleUploadRecording,
  };
};
