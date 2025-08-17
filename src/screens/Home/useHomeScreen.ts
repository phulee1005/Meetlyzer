import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootStackNavigationProp } from "@navigation/type";
import { RootState, AppDispatch } from "@store/index";
import {
  resetUpload,
  setUploading,
  setSuccess,
  setError,
} from "@store/uploadSlice";
import { useUploadMeetingMutation } from "services/uploadApi";
import { Alert } from "react-native";
import { showSuccess } from "components/CustomModal";
import { Language } from "components/JoinLiveModal";
import { validateMeetingLink } from "utils/validate";
import {
  useJoinMeetMutation,
  useGetLiveMeetingsQuery,
  useRegisterCalendarMutation,
  useGetGoogleMeetingsQuery,
  useUnregisterCalendarMutation,
} from "services/bot";
import { MeetingGoogleCalendar, RecordMeeting } from "types/record";
import googleSignInService from "services/googleSignIn";
import { socket } from "utils/socket";

export interface ActionItem {
  id: string;
  icon: string;
  label: string;
  onPress: () => void;
}

export const useHomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<RootStackNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showJoinLiveModal, setShowJoinLiveModal] = useState(false);
  const [showGoogleCalendarModal, setShowGoogleCalendarModal] = useState(false);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const [uploadMeeting, { isLoading: isUploading }] =
    useUploadMeetingMutation();
  const [joinMeet, { isLoading: isJoining }] = useJoinMeetMutation();
  const [registerCalendar, { isLoading: isRegistering }] =
    useRegisterCalendarMutation();
  const [unregisterCalendar, { isLoading: isUnregistering }] =
    useUnregisterCalendarMutation();
  const {
    data: streamingData,
    isLoading: isLoadingStreaming,
    refetch,
  } = useGetLiveMeetingsQuery(undefined, {
    pollingInterval: 5000, // Refetch every 5 seconds
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });
  const {
    data: googleCalendarData,
    isLoading: isLoadingGoogleCalendar,
    refetch: refetchGoogleCalendar,
  } = useGetGoogleMeetingsQuery(
    { today: true },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );

  useEffect(() => {
    const scheduleGoogleChannel = "google_calendar";

    socket.on(scheduleGoogleChannel, () => {
      refetchGoogleCalendar();
    });

    return () => {
      socket.off(scheduleGoogleChannel);
    };
  }, [navigation]);

  // Upload state from Redux
  const { progress, error, success } = useSelector(
    (state: RootState) => state.upload
  );

  const handleNavigateToDocumentDetail = useCallback(
    (id: string) => {
      navigation.navigate("DocumentDetail", {
        id: id,
      });
    },
    [navigation]
  );

  // Action handlers
  const handleRecordPress = useCallback(() => {
    navigation.navigate("Record");
  }, [navigation]);

  const handleImportPress = useCallback(() => {
    setShowUploadModal(true);
  }, []);

  const handleJoinLivePress = useCallback(() => {
    setShowJoinLiveModal(true);
  }, []);

  const handleJoinLivePressFromEmpty = useCallback(() => {
    setShowJoinLiveModal(true);
  }, []);

  const handleJoinLiveModalClose = useCallback(() => {
    setShowJoinLiveModal(false);
  }, []);

  const handleJoinLiveModalReset = useCallback(() => {
    // Reset form khi modal được đóng
    setShowJoinLiveModal(false);
  }, []);

  const handleJoinLive = useCallback(
    async (url: string, language: Language) => {
      try {
        // Validate meeting URL
        const validationResult = validateMeetingLink(url);
        if (!validationResult.validate || !validationResult.platform) {
          Alert.alert("Error", "Invalid meeting URL");
          return;
        }

        // Call join meeting API
        const result = await joinMeet({
          platform: validationResult.platform,
          meetingCode: validationResult.meetingCode,
          params: validationResult.params,
          languageCode: language,
        }).unwrap();

        if (result?.response?._id) {
          // Đóng modal trước khi navigate
          setShowJoinLiveModal(false);

          // Navigate to JoinMeeting screen
          navigation.navigate("JoinMeeting", {
            meetingId: result?.response?._id,
            platform: validationResult.platform,
            meetingCode: validationResult.meetingCode,
          });
        }
      } catch (error: any) {
        console.error("Join meeting error:", error);
        Alert.alert(
          "Error",
          error?.data?.message || "Failed to join meeting. Please try again."
        );
      }
    },
    [joinMeet, navigation]
  );

  const handleSchedulePress = useCallback(() => {
    setShowGoogleCalendarModal(true);
  }, []);

  const handleGoogleCalendarModalClose = useCallback(() => {
    setShowGoogleCalendarModal(false);
  }, []);

  const handleToggleGoogleCalendar = useCallback(async () => {
    if (!userInfo) return;

    const isRegistered = googleCalendarData?.response?.registerGoogleCalendar;

    if (isRegistered) {
      try {
        const result = await unregisterCalendar().unwrap();
        if (result?.success) {
          refetchGoogleCalendar();
        }
      } catch (error: any) {
        console.error("Unregister calendar error:", error);
      }
    } else {
      try {
        const res = await googleSignInService.registerCalendar(userInfo.email);
        const result = await registerCalendar(res).unwrap();
        if (result?.success) {
          refetchGoogleCalendar();
        }
      } catch (error: any) {
        console.error("Register calendar error:", error);
      }
    }
  }, [
    userInfo,
    googleCalendarData,
    unregisterCalendar,
    registerCalendar,
    refetchGoogleCalendar,
    t,
  ]);

  const handleStreamingItemPress = useCallback(
    (item: RecordMeeting) => {
      //todo after
      navigation.navigate("JoinMeeting", {
        meetingId: item._id,
        platform: item.platform,
        meetingCode: item.meetingCode,
      });
    },
    [navigation]
  );

  const handleExpertItemPress = useCallback((item: MeetingGoogleCalendar) => {
    console.log("Expert item pressed:", item.summary);
  }, []);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const handleUploadModalClose = useCallback(() => {
    setShowUploadModal(false);
    dispatch(resetUpload());
  }, [dispatch]);

  // Reset upload state when modal is closed
  useEffect(() => {
    if (!showUploadModal) {
      // Reset upload state when modal is closed
      dispatch(resetUpload());
    }
  }, [showUploadModal, dispatch]);

  // Refetch streaming data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // Refetch streaming data on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleUpload = useCallback(
    async (fileUri?: string, fileName?: string) => {
      if (!fileUri || !fileName) {
        Alert.alert("No file selected", "Please select a video file first");
        return;
      }

      try {
        // Create file object from URI
        const file = {
          uri: fileUri,
          type: "video/*",
          name: fileName,
        };

        // Reset upload state
        dispatch(resetUpload());
        dispatch(setUploading(true));

        // Upload using RTK Query
        const result = await uploadMeeting({ file }).unwrap();
        dispatch(setSuccess(true));
        setShowUploadModal(false);
        if (result.response?._id) {
          showSuccess(t("home.uploadSuccess"), t("home.success"), () => {
            handleNavigateToDocumentDetail(result?.response?._id as string);
          });
        }
      } catch (error: any) {
        console.error("Upload error:", error);
        dispatch(setError(error.message || "Upload failed"));
        Alert.alert(
          "Upload Failed",
          error.message || "Failed to upload video. Please try again."
        );
      } finally {
        dispatch(setUploading(false));
      }
    },
    [dispatch, uploadMeeting, t, handleNavigateToDocumentDetail]
  );

  // Action items data
  const actionItems: ActionItem[] = [
    {
      id: "1",
      icon: "mic",
      label: t("home.record"),
      onPress: handleRecordPress,
    },
    {
      id: "2",
      icon: "cloud-upload",
      label: t("home.import"),
      onPress: handleImportPress,
    },
    {
      id: "3",
      icon: "link",
      label: t("home.joinLive"),
      onPress: handleJoinLivePress,
    },
    {
      id: "4",
      icon: "calendar",
      label: t("home.schedule"),
      onPress: handleSchedulePress,
    },
  ];

  return {
    // Data
    streamingData: streamingData?.response || [],
    actionItems,
    searchQuery,
    showUploadModal,
    showJoinLiveModal,
    showGoogleCalendarModal,
    googleCalendarData: googleCalendarData?.response,
    isGoogleCalendarRegistered:
      googleCalendarData?.response?.registerGoogleCalendar || false,

    // Loading states
    isLoadingStreaming,
    isLoadingGoogleCalendar,

    // Upload state
    isUploading,
    isJoining,
    isRegistering,
    isUnregistering,
    progress,
    error,
    success,

    // Handlers
    handleStreamingItemPress,
    handleExpertItemPress,
    handleSearchChange,
    handleUploadModalClose,
    handleUpload,
    handleJoinLiveModalClose,
    handleJoinLiveModalReset,
    handleJoinLive,
    handleJoinLivePressFromEmpty,
    handleGoogleCalendarModalClose,
    handleToggleGoogleCalendar,
    refetch,
    refetchGoogleCalendar,
  };
};
