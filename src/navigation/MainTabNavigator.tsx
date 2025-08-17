import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import HomeScreen from "@screens/Home/HomeScreen";
import CalendarScreen from "@screens/Calendar/CalendarScreen";
import DocumentScreen from "@screens/Document/DocumentScreen";
import ProfileScreen from "@screens/Profile/ProfileScreen";
import { Colors } from "constants/colors";
import { TabParamList } from "./type";
import { socket } from "utils/socket";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";

const Tab = createBottomTabNavigator<TabParamList>();

export default function MainTabNavigator() {
  const { t } = useTranslation();
  const { userInfo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (userInfo?._id) {
      socket.connect();

      return () => {
        socket.disconnect();
      };
    }
  }, [userInfo]);

  useEffect(() => {
    socket.on("connect", () => {
      if (userInfo) {
        socket.emit("user-connection", { userId: userInfo?._id });
      }
    });
  }, [socket]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Calendar") {
            iconName = "calendar-outline";
          } else if (route.name === "Document") {
            iconName = "document-text-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.blue,
        tabBarInactiveTintColor: Colors.secondaryText,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: t("home.title") }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ title: "Calendar" }}
      />
      <Tab.Screen
        name="Document"
        component={DocumentScreen}
        options={{ title: "Document" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}
