import React, { useEffect } from "react";
import MainTabNavigator from "./MainTabNavigator";
import AuthNavigator from "./AuthNavigator";
import { RecordScreen } from "@screens/Record";
import RecordDetailScreen from "@screens/RecordDetail/RecordDetailScreen";
import DocumentDetailScreen from "@screens/DocumentDetail/DocumentDetailScreen";
import JoinMeetingScreen from "@screens/JoinMeeting/JoinMeetingScreen";
import { Stack, RootStackParamList } from "@navigation/type";
import { useSelector } from "react-redux";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import navigatorName from "constants/navigatorName";
import ChangePassword from "@screens/ChangePassword/ChangePassword";
import ResetPasswordScreen from "@screens/ResetPassword/ResetPasswordScreen";

export default function RootNavigator() {
  const { AUTH, TAB } = navigatorName;
  const accessToken = useSelector((state: any) => state.user.accessToken);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (accessToken) {
      navigation.reset({
        index: 0,
        routes: [{ name: TAB }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: AUTH }],
      });
    }
  }, [accessToken]);

  return (
    <Stack.Navigator initialRouteName={accessToken ? TAB : AUTH}>
      <Stack.Screen
        name={AUTH}
        component={AuthNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={TAB}
        component={MainTabNavigator}
        options={{
          headerShown: false,
          gestureEnabled: false,
          animationTypeForReplace: "pop",
        }}
      />
      <Stack.Screen
        name="Record"
        component={RecordScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RecordDetail"
        component={RecordDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DocumentDetail"
        component={DocumentDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="JoinMeeting"
        component={JoinMeetingScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
}
