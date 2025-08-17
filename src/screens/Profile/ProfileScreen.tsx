import React from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { fontScale, heightScale, widthScale } from "utils/scale";
import { Colors } from "constants/colors";
import { clearUser } from "@store/userSlice";
import { RootState } from "@store/index";
import UserInfoHeader from "@components/UserInfoHeader";
import ProfileMenuItem from "@components/ProfileMenuItem";
import LogoutButton from "@components/LogoutButton";
import VersionInfo from "@components/VersionInfo";
import { useLanguage } from "hooks/useLanguage";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { currentLanguage, changeLanguage } = useLanguage();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const handleLogout = () => {
    dispatch(clearUser());
  };

  const handleLanguageChange = (language: "vi" | "en") => {
    changeLanguage(language);
  };

  const handleChangePassword = () => {
    Alert.alert(t("profile.comingSoon"), t("profile.featureDescription"), [
      { text: t("modal.ok") },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("profile.title")}</Text>
      </View>

      <UserInfoHeader userInfo={userInfo} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("profile.personalInfo")}</Text>

        <ProfileMenuItem
          title={t("profile.language")}
          subtitle={
            currentLanguage === "vi"
              ? t("profile.vietnamese")
              : t("profile.english")
          }
          onPress={() => {}}
          showLanguageSelector={true}
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />

        <ProfileMenuItem
          title={t("profile.changePassword")}
          subtitle={t("profile.comingSoon")}
          onPress={handleChangePassword}
        />
      </View>

      <View style={styles.logoutSection}>
        <LogoutButton onLogout={handleLogout} />
      </View>

      <VersionInfo />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: widthScale(16),
    paddingVertical: heightScale(20),
    paddingTop: heightScale(60),
  },
  title: {
    fontSize: fontScale(24),
    fontWeight: "bold",
    color: Colors.primaryText,
  },
  section: {
    marginTop: heightScale(20),
  },
  sectionTitle: {
    fontSize: fontScale(18),
    fontWeight: "600",
    color: Colors.primaryText,
    marginHorizontal: widthScale(16),
    marginBottom: heightScale(12),
  },
  logoutSection: {
    marginTop: heightScale(40),
    marginBottom: heightScale(20),
  },
});
