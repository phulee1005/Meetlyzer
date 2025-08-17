import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { widthScale, heightScale, fontScale } from "utils/scale";
import { Colors } from "constants/colors";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "store";

export default function Header() {
  const { t } = useTranslation();
  const { userInfo } = useSelector((state: RootState) => state.user);

  return (
    <View style={styles.container}>
      <View style={styles.greeting}>
        <Text style={styles.helloText}>Meetlyzer</Text>
        <Text style={styles.nameText}>
          {t("home.hi", { name: userInfo?.name })}
        </Text>
      </View>
      <View style={styles.avatar}>
        <View style={styles.avatarBackground}>
          {(userInfo?.avatar && (
            <Image source={{ uri: userInfo?.avatar }} />
          )) || <Ionicons name="person" size={24} color={Colors.white} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: widthScale(20),
    paddingVertical: heightScale(10),
  },
  greeting: {
    flex: 1,
  },
  helloText: {
    fontSize: fontScale(14),
    fontWeight: "bold",
    color: Colors.primaryText,
    marginBottom: heightScale(2),
  },
  nameText: {
    fontSize: fontScale(24),
    fontWeight: "bold",
    color: Colors.primaryText,
  },
  avatar: {
    position: "relative",
  },
  avatarBackground: {
    width: widthScale(50),
    height: widthScale(50),
    borderRadius: widthScale(25),
    backgroundColor: Colors.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarAccent: {
    position: "absolute",
    top: -widthScale(5),
    right: -widthScale(5),
    width: widthScale(20),
    height: widthScale(20),
    borderRadius: widthScale(10),
    backgroundColor: Colors.orange,
  },
});
