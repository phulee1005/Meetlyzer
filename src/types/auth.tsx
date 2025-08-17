export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  userInfo?: UserInfo;
}

export type UserInfo = {
  registerGoogleCalendar: boolean;
  _id: string;
  email: string;
  avatar: string;
  emailVerified: boolean;
  isActive: boolean;
  name: string;
  domain: string;
  googleAccessToken: string;
  googleRefreshToken: string;
  userSubcriptions: UserSubcription;
};

export type UserSubcription = any;

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};
