import { createSlice } from "@reduxjs/toolkit";

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
}

const initialState: UploadState = {
  isUploading: false,
  progress: 0,
  error: null,
  success: false,
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    resetUpload: (state) => {
      state.isUploading = false;
      state.progress = 0;
      state.error = null;
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUploading: (state, action) => {
      state.isUploading = action.payload;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProgress,
  resetUpload,
  clearError,
  setUploading,
  setSuccess,
  setError,
} = uploadSlice.actions;

export default uploadSlice.reducer;
