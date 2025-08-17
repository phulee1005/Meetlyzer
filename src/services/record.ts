import { Pagination, RTKResponse, RTKResponsePagination } from "types/rtk";
import { api } from "./api";
import { RecordMeeting, SUMMARY_CORE } from "types/record";

// RTK Query queries
export const recordApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRecords: builder.query<RTKResponsePagination<RecordMeeting>, Pagination>(
      {
        query: (params) => {
          const requestParams = {
            page: params.page,
            limit: params.limit,
            orderBy: params.orderBy,
            ...(params.keyword && { keyword: params.keyword }),
          };

          return {
            url: "/meeting/records",
            method: "GET",
            params: requestParams,
          };
        },
        providesTags: ["Record"],
      }
    ),
    getMeetingInfo: builder.query<RTKResponse<RecordMeeting>, string>({
      query: (recordId) => ({
        url: `/meeting/info/${recordId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
    createSummary: builder.mutation<
      RTKResponse<RecordMeeting>,
      { meetingId: string; language?: string }
    >({
      query: ({ meetingId, language = "vi" }) => ({
        url: `/ai/summary/${meetingId}/${SUMMARY_CORE.GPT}/${language}`,
        method: "GET",
      }),
      invalidatesTags: (result, error, { meetingId }) => [
        { type: "Record", id: meetingId },
      ],
    }),
  }),
});

export const {
  useGetRecordsQuery,
  useGetMeetingInfoQuery,
  useCreateSummaryMutation,
} = recordApi;
