import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { RecordMeeting } from "types/record";
import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  Auth: undefined;
  Login: undefined;
  Register: undefined;
  OTPVerification: { email: string; password: string };
  Home: undefined;
  Profile: undefined;
  App: NavigatorScreenParams<TabParamList>;
  Tab: undefined;
  Record: undefined;
  RecordDetail: {
    record: RecordMeeting;
  };
  DocumentDetail: {
    id: string;
  };
  JoinMeeting: {
    meetingId: string;
    platform: string;
    meetingCode: string;
  };
  ChangePassword: undefined;
  ResetPassword: { email: string; accessKey: string };
  ForgotPassword: undefined;
};

export type TabParamList = {
  Home: undefined;
  Calendar: undefined;
  Document: undefined;
  Profile: undefined;
};

export const Stack = createNativeStackNavigator<RootStackParamList>();
export const Tab = createBottomTabNavigator<TabParamList>();

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;
export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;
