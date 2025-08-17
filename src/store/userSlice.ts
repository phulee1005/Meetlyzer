import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import { LoginResponse } from "types/auth";

const initialState: LoginResponse = {
  accessToken: undefined,
  refreshToken: undefined,
  userInfo: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userInfo = action.payload.userInfo;
    },
    clearUser: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
