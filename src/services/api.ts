import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL, API_VERSION } from "@env";
import { RootState } from "store";
import { showConfirm } from "components/CustomModal";
import { clearUser } from "store/userSlice";
import { getTranslation, TRANSLATION_KEYS } from "utils/i18n";

// Fallback URL nếu environment variable không có
const getBaseUrl = () => {
  let baseUrl;

  if (BACKEND_URL) {
    // Kiểm tra xem BACKEND_URL đã có /api/v1 chưa
    if (BACKEND_URL.includes("/api/")) {
      baseUrl = BACKEND_URL;
    } else {
      baseUrl = `${BACKEND_URL}/api/${API_VERSION || "v1"}`;
    }
  } else {
    baseUrl = "http://localhost:8911/api/v1";
  }

  return baseUrl;
};

// Flag để tránh hiển thị dialog nhiều lần
let isShowing401Dialog = false;

// Custom base query với xử lý lỗi 401
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result = await fetchBaseQuery({
    baseUrl: getBaseUrl(),
    timeout: 30000, // 30 seconds timeout
    prepareHeaders: (headers, { getState }) => {
      // Lấy token từ state
      const state = getState() as RootState;
      const accessToken = state.user.accessToken;

      if (accessToken) {
        headers.set("authorization", `Bearer ${accessToken}`);
      }

      // Chỉ set Content-Type nếu không phải multipart/form-data
      if (!headers.get("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      return headers;
    },
  })(args, api, extraOptions);

  // Xử lý lỗi 401
  if (result.error && "status" in result.error && result.error.status === 401) {
    // Kiểm tra xem dialog đã hiển thị chưa
    if (!isShowing401Dialog) {
      isShowing401Dialog = true;

      // Hiển thị dialog thông báo và xác nhận logout
      showConfirm(
        getTranslation(TRANSLATION_KEYS.SESSION_EXPIRED.MESSAGE),
        getTranslation(TRANSLATION_KEYS.SESSION_EXPIRED.TITLE),
        () => {
          // Xác nhận logout
          api.dispatch(clearUser());
          isShowing401Dialog = false;
        },
        () => {
          // Hủy bỏ - không làm gì
          isShowing401Dialog = false;
        }
      );
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ["User", "Auth", "Record", "Streaming", "GoogleCalendar"],
});
