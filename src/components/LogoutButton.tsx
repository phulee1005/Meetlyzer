import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { fontScale, heightScale, widthScale } from "utils/scale";
import { Colors } from "constants/colors";

interface LogoutButtonProps {
  onLogout: () => void;
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  const { t } = useTranslation();

  const handleLogout = () => {
    Alert.alert(t("profile.logout"), t("profile.logoutConfirm"), [
      {
        text: t("profile.cancel"),
        style: "cancel",
      },
      {
        text: t("profile.confirm"),
        style: "destructive",
        onPress: onLogout,
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleLogout}>
      <Text style={styles.text}>{t("profile.logout")}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.red,
    marginHorizontal: widthScale(16),
    marginVertical: heightScale(8),
    borderRadius: widthScale(12),
    paddingVertical: heightScale(16),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: fontScale(16),
    fontWeight: "600",
    color: Colors.white,
  },
});
