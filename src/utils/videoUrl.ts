import { BACKEND_URL, API_VERSION } from "@env";

export const createVideoUrl = (filename: string): string => {
  if (!filename) {
    return "";
  }

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

  return `${baseUrl}/file/${filename}`;
};
