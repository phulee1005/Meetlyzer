import { RTKResponse } from "types/rtk";
import { api } from "./api";
import {
  RecordMeeting,
  MessageInMeeting,
  TranslationAI,
  GoogleMeetingsResponse,
} from "types/record";
import { BACKEND_URL } from "@env";

// Join Meet Types
export interface JoinMeetType {
  platform: string;
  meetingCode: string;
  params?: string | null;
  languageCode: string;
}

export interface RegisterCalendarType {
  email: string;
  accessToken: string;
  refreshToken: string;
}

export interface StopMeetType {
  meetingId: string;
}

// Record Types
export interface RecordInfo {
  recording: boolean;
  chatMessages: MessageInMeeting[];
  transcripts: TranslationAI[];
  meetingDetail: RecordMeeting;
  participants: number;
}

export const botApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Join Meet endpoints
    joinMeet: builder.mutation<RTKResponse<RecordMeeting>, JoinMeetType>({
      query: (payload) => ({
        url: "/bot/join-meet",
        method: "POST",
        body: payload,
        timeout: 45000, // 45 seconds timeout for join meeting
      }),
      invalidatesTags: ["Streaming"],
    }),
    stopMeet: builder.mutation<RTKResponse<null>, StopMeetType>({
      query: (payload) => ({
        url: `/bot/stop/${payload.meetingId}`,
        method: "POST",
        timeout: 60000, // 60 seconds timeout for stop meeting
      }),
      invalidatesTags: ["Streaming"],
    }),

    // Record endpoints
    infoMeetRecording: builder.query<RTKResponse<RecordInfo>, string>({
      query: (recordId) => ({
        url: `/bot/info/${recordId}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),

    // Streaming endpoints
    getLiveMeetings: builder.query<RTKResponse<RecordMeeting[]>, void>({
      query: () => ({
        url: "/meeting/live",
        method: "GET",
      }),
      providesTags: ["Streaming"],
      keepUnusedDataFor: 0,
    }),
    registerCalendar: builder.mutation<RTKResponse<null>, RegisterCalendarType>(
      {
        query: (payload) => ({
          url: "/google/register-calendar",
          method: "POST",
          body: { ...payload, domainUrl: BACKEND_URL },
        }),
      }
    ),

    getGoogleMeetings: builder.query<
      RTKResponse<GoogleMeetingsResponse>,
      { today: boolean }
    >({
      query: (payload) => ({
        url: `/google/meetings${payload.today ? "?today=true" : ""}`,
        method: "GET",
      }),
      providesTags: ["GoogleCalendar"],
    }),
    unregisterCalendar: builder.mutation<RTKResponse<null>, void>({
      query: () => ({
        url: "/google/unregister-calendar",
        method: "POST",
      }),
      invalidatesTags: ["GoogleCalendar"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useJoinMeetMutation,
  useStopMeetMutation,
  useInfoMeetRecordingQuery,
  useGetLiveMeetingsQuery,
  useRegisterCalendarMutation,
  useGetGoogleMeetingsQuery,
  useUnregisterCalendarMutation,
} = botApi;
