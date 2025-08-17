import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { socket } from "utils/socket";
import { RootStackNavigationProp } from "@navigation/type";
import {
  JOINING_STATUS,
  MessageInMeeting,
  RecordMeeting,
  TranslationAI,
} from "types/record";
import { useInfoMeetRecordingQuery, useStopMeetMutation } from "services/bot";
import { showError, showInfo } from "components/CustomModal";
import navigatorName from "constants/navigatorName";

export const useJoinMeeting = (meetingId: string) => {
  const { t } = useTranslation();
  const { TAB } = navigatorName;
  const navigation = useNavigation<RootStackNavigationProp>();
  const [messages, setMessages] = useState<MessageInMeeting[]>([]);
  const [transcript, setTranscript] = useState<TranslationAI[]>([]);
  const [recordDetails, setRecordDetails] = useState<RecordMeeting>();

  const [stopMeet, { isLoading: isStopping }] = useStopMeetMutation();

  const { data: recordInfo, isLoading } = useInfoMeetRecordingQuery(meetingId, {
    skip: !meetingId,
  });

  useEffect(() => {
    if (meetingId) {
      const chatChannel = meetingId + "_chat";
      socket.on(chatChannel, (res: MessageInMeeting) => {
        if (res) {
          setMessages((prev) => [...prev, res]);
        }
      });

      return () => {
        socket.off(chatChannel);
      };
    }
  }, [meetingId]);

  // Handle participant updates
  useEffect(() => {
    if (meetingId) {
      const participantChannel = meetingId + "_participant";
      socket.on(participantChannel, (res: { participant: number }) => {
        if (res) {
          if (res.participant <= 1) {
            showInfo(
              t("joinMeeting.info.noParticipant"),
              t("joinMeeting.info.title"),
              () =>
                navigation.navigate("DocumentDetail", {
                  id: meetingId,
                })
            );
          }
        }
      });

      return () => {
        socket.off(participantChannel);
      };
    }
  }, [meetingId, navigation]);

  // Handle transcript updates
  useEffect(() => {
    const streamChannel = meetingId + "_stream";
    if (meetingId) {
      socket.on(streamChannel, (res: TranslationAI) => {
        if (res) {
          setTranscript((prev) => {
            if (res?.newWords) {
              return [...prev, res];
            } else {
              const updatedTranscript = [...prev];
              const lastElement =
                updatedTranscript[updatedTranscript.length - 1];
              if (lastElement) {
                updatedTranscript[updatedTranscript.length - 1] = {
                  ...lastElement,
                  transcript: res.transcript,
                };
              }
              return updatedTranscript;
            }
          });
        }
      });

      return () => {
        socket.off(streamChannel);
      };
    }
  }, [meetingId, navigation]);

  // Handle joining status updates
  useEffect(() => {
    const joiningChannel = meetingId + "_joining_status";
    if (meetingId) {
      socket.on(
        joiningChannel,
        (res: { joiningStatus: JOINING_STATUS; organizer?: string }) => {
          setRecordDetails((prev: any) => {
            if (!prev) return null;
            return {
              ...prev,
              ...res,
            };
          });
          if (res.joiningStatus === JOINING_STATUS.FAILED) {
            showError(
              t("joinMeeting.error.joinFailed"),
              t("joinMeeting.error.title"),
              () => navigation.navigate(TAB, { screen: "Home" })
            );
            socket.off(joiningChannel);
          }
        }
      );

      return () => {
        socket.off(joiningChannel);
      };
    }
  }, [meetingId, navigation]);

  // Update states when recordInfo changes
  useEffect(() => {
    if (recordInfo?.response) {
      const { recording, chatMessages, transcripts, meetingDetail } =
        recordInfo.response;
      if (recording) {
        setMessages(chatMessages || []);
        setTranscript(transcripts || []);
        setRecordDetails(meetingDetail);
      } else {
        showError(
          t("joinMeeting.error.recordNotFound"),
          t("joinMeeting.error.title"),
          () => navigation.goBack()
        );
      }
    }
  }, [recordInfo, navigation, t]);

  const handleStopMeeting = async () => {
    try {
      const result = await stopMeet({ meetingId }).unwrap();

      if (result?.success) {
        showInfo(
          t("joinMeeting.info.stopMeeting"),
          t("joinMeeting.info.stopMeetingTitle"),
          () =>
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: TAB,
                    state: {
                      routes: [{ name: "Document" }],
                    },
                  },
                  {
                    name: "DocumentDetail",
                    params: {
                      id: meetingId,
                    },
                  },
                ],
              })
            )
        );
      }
    } catch (error: any) {
      console.error("Stop meeting error:", error);

      let errorMessage = t("joinMeeting.stop.failed");

      // Handle specific timeout error
      if (
        error?.status === "TIMEOUT_ERROR" ||
        error?.error === "AbortError: Aborted"
      ) {
        errorMessage = t("joinMeeting.stop.timeout");
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      showError(errorMessage, t("joinMeeting.stop.title"), () => {});
    }
  };

  return {
    messages,
    transcript,
    recordDetails,
    isLoading,
    handleStopMeeting,
    isStopping,
  };
};
