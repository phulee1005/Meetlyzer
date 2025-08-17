import { useState, useEffect } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  useGetMeetingInfoQuery,
  useCreateSummaryMutation,
} from "services/record";
import { socket } from "utils/socket";
import { RecordMeeting, TRANSLATE_STATUS } from "types/record";

type DocumentDetailRouteProp = RouteProp<
  {
    DocumentDetail: { id: string };
  },
  "DocumentDetail"
>;

export const useDocumentDetail = () => {
  const route = useRoute<DocumentDetailRouteProp>();
  const [documentData, setDocumentData] = useState<RecordMeeting>();
  const [isTranslating, setIsTranslating] = useState(false);
  const { id } = route.params;
  const { i18n } = useTranslation();

  const {
    data: data,
    isLoading,
    error,
    refetch,
  } = useGetMeetingInfoQuery(id, {
    skip: !id,
  });

  useEffect(() => {
    if (data) {
      setDocumentData(data.response);
      // Check if translation is in progress
      if (
        data.response?.translateStatus &&
        data.response.translateStatus !== TRANSLATE_STATUS.DONE &&
        data.response.translateStatus !== TRANSLATE_STATUS.FAILED
      ) {
        setIsTranslating(true);
      } else {
        setIsTranslating(false);
      }
    }
  }, [data]);

  useEffect(() => {
    if (id) {
      const translationChannel = id + "_translation";
      const summaryChannel = id + "_summary";

      socket.on(translationChannel, (res) => {
        if (res) {
          setDocumentData((pre: any) => {
            const updatedData = {
              ...pre,
              translateStatus: res.status,
              translationAI: res.transcripts,
              recordUri: res.recordUri,
            };

            // Update translating state based on status
            if (
              res.status === TRANSLATE_STATUS.DONE ||
              res.status === TRANSLATE_STATUS.FAILED ||
              res.status === TRANSLATE_STATUS.SUMMARY
            ) {
              setIsTranslating(false);
            } else {
              setIsTranslating(true);
            }

            return updatedData;
          });
        }
      });

      socket.on(summaryChannel, (res) => {
        if (res) {
          setDocumentData((pre: any) => {
            return {
              ...pre,
              ...res,
            };
          });
        }
      });

      return () => {
        socket.off(translationChannel);
        socket.off(summaryChannel);
      };
    }
  }, []);

  const [createSummary, { isLoading: isCreatingSummary }] =
    useCreateSummaryMutation();

  const handleCreateSummary = async () => {
    try {
      await createSummary({
        meetingId: id,
        language: i18n.language,
      });
      refetch();
    } catch (error) {
      console.error("Failed to create summary:", error);
    }
  };

  return {
    id,
    isLoading,
    data: documentData,
    error: error ? "Failed to load document" : null,
    refetch,
    handleCreateSummary,
    isCreatingSummary:
      isCreatingSummary ||
      documentData?.translateStatus === TRANSLATE_STATUS.SUMMARY,
    isTranslating,
  };
};
