import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { fontScale, heightScale, widthScale } from "utils/scale";
import { Colors } from "constants/colors";
import { UserInfo } from "types/auth";
import Ionicons from "@expo/vector-icons/Ionicons";

interface UserInfoHeaderProps {
  userInfo?: UserInfo;
}

export default function UserInfoHeader({ userInfo }: UserInfoHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <View style={styles.avatarBackground}>
          {(userInfo?.avatar && (
            <Image source={{ uri: userInfo?.avatar }} />
          )) || <Ionicons name="person" size={24} color={Colors.white} />}
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{userInfo?.name || "User"}</Text>
        <Text style={styles.email}>
          {userInfo?.email || "user@example.com"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: widthScale(16),
    paddingVertical: heightScale(20),
    backgroundColor: Colors.white,
    marginHorizontal: widthScale(16),
    marginVertical: heightScale(8),
    borderRadius: widthScale(12),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: widthScale(52),
    height: heightScale(52),
    borderRadius: widthScale(26),
    borderWidth: 1,
    borderColor: Colors.blue,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginLeft: widthScale(12),
  },
  name: {
    fontSize: fontScale(18),
    fontWeight: "bold",
    color: Colors.primaryText,
    marginBottom: heightScale(4),
  },
  email: {
    fontSize: fontScale(14),
    color: Colors.secondaryText,
  },
  avatarBackground: {
    width: widthScale(50),
    height: widthScale(50),
    borderRadius: widthScale(25),
    backgroundColor: Colors.blue,
    alignItems: "center",
    justifyContent: "center",
  },
});
