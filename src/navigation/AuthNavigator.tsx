import React from "react";
import LoginScreen from "@screens/Login/LoginScreen";
import RegisterScreen from "@screens/Register/RegisterScreen";
import OTPVerificationScreen from "@screens/OTPVerification/OTPVerificationScreen";
import { Stack } from "@navigation/type";
import navigatorName from "constants/navigatorName";

const { LOGIN, REGISTER } = navigatorName;

export default function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={LOGIN}
        component={LoginScreen}
        options={{
          gestureEnabled: false,
          headerShown: false,
          presentation: "card",
        }}
      />
      <Stack.Screen
        name={REGISTER}
        component={RegisterScreen}
        options={{ headerShown: false, presentation: "card" }}
      />
      <Stack.Screen
        name="OTPVerification"
        component={OTPVerificationScreen}
        options={{ headerShown: false, presentation: "card" }}
      />
    </Stack.Navigator>
  );
}
