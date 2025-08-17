import { RTKResponse } from "types/rtk";
import { api } from "./api";
import { RecordMeeting } from "types/record";

// RTK Query mutations
export const uploadApi = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadMeeting: builder.mutation<RTKResponse<RecordMeeting>, { file: any }>({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "/meeting/import",
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
      },
      invalidatesTags: ["Record"],
    }),
  }),
});

export const { useUploadMeetingMutation } = uploadApi;
