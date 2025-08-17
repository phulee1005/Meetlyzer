import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userReducer from "@store/userSlice";
import uploadReducer from "@store/uploadSlice";
import { api } from "services/api";

// Cấu hình persist cho từng reducer
const userPersistConfig = {
  key: "user",
  storage: AsyncStorage,
  whitelist: ["accessToken", "refreshToken", "userInfo"], // Chỉ lưu các field cần thiết
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    upload: uploadReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(api.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
