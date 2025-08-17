import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { JOINING_STATUS, RecordMeeting } from "types/record";
import { useGetRecordsQuery } from "services/record";
import { Pagination, DEFAULT_PARAMS } from "types/rtk";
import { RootStackNavigationProp } from "@navigation/type";

export const useDocumentScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  const [documents, setDocuments] = useState<RecordMeeting[]>([]);
  const [params, setParams] = useState<Pagination>(DEFAULT_PARAMS);

  const {
    data: recordsResponse,
    isLoading: isLoading,
    refetch,
    isFetching: isFetching,
  } = useGetRecordsQuery(params);

  useEffect(() => {
    const { data = [], pagination } = recordsResponse?.response || { data: [] };
    if (pagination?.page === 1) {
      setDocuments(data);
    } else {
      setDocuments((prev) => [...prev, ...data]);
    }
  }, [recordsResponse?.response]);

  const pagination = useMemo((): {
    limit: number;
    page: number;
    pageCount: number;
    total: number;
  } => {
    return (
      recordsResponse?.response?.pagination || {
        limit: 0,
        page: 0,
        pageCount: 0,
        total: 0,
      }
    );
  }, [recordsResponse?.response]);

  const handleDocumentPress = useCallback(
    (document: RecordMeeting) => {
      if (
        document.recording ||
        document.joiningStatus === JOINING_STATUS.NEW ||
        document.joiningStatus === JOINING_STATUS.PROCESSING
      ) {
        navigation.navigate("JoinMeeting", {
          meetingId: document._id,
          meetingCode: document.meetingCode,
          platform: document.platform,
        });
      } else {
        // Navigate to DocumentDetail with document id
        navigation.navigate("DocumentDetail", {
          id: document._id,
        });
      }
    },
    [navigation]
  );

  const handleLoadMore = useCallback(async () => {
    if (pagination.page < pagination.pageCount && !isFetching) {
      setParams((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  }, [pagination.page, isFetching]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setParams((prev) => ({
      ...prev,
      page: 1,
    }));
    try {
      await refetch();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  return {
    documents,
    isFetching,
    currentPage: pagination.page,
    totalPages: pagination.pageCount,
    isLoading,
    refreshing,
    hasMore: pagination.page < pagination.pageCount,
    totalRecords: pagination.total,
    handleSearchChange: (text: string) => {
      setParams((prev) => ({
        ...prev,
        keyword: text,
      }));
    },

    // Handlers
    handleDocumentPress,
    handleLoadMore,
    handleRefresh,
  };
};
