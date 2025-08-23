import React from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { fontScale, widthScale, heightScale } from "utils/scale";
import Images from "assets/images";
import ButtonLoading from "components/Button";
import { useTranslation } from "react-i18next";
import CustomTextInput from "components/TextInput";
import { useKeyboardAnimation } from "hooks/useKeyboardAnimation";
import { Colors } from "constants/colors";
import { useChangePassword } from "./useChangePassword";
import { RootStackParamList } from "@navigation/type";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "ChangePassword">;

export default function ChangePassword({ navigation }: Props) {
  const { t } = useTranslation();

  const {
    bgImageTranslateY,
    bgImageOpacity,
    contentTranslateY,
    handleInputFocus,
  } = useKeyboardAnimation({
    contentTranslateYValue: heightScale(-100),
    bgImageTranslateYValue: heightScale(-100),
    autoListenKeyboard: true,
  });

  const {
    oldPassword,
    newPassword,
    confirmPassword,
    setOldPassword,
    setNewPassword,
    setConfirmPassword,
    handleChangePassword,
    isLoading,
    error,
  } = useChangePassword();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.header}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back-outline"
            size={fontScale(28)}
            color={Colors.primaryText}
          />
          <Text style={styles.title}>{t("changePassword.title")}</Text>
        </TouchableOpacity>

        <ScrollView
          scrollEnabled={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.passwordContainer}>
            <Animated.Image
              source={Images.password}
              style={[
                styles.bgImage,
                {
                  transform: [{ translateY: bgImageTranslateY }],
                  opacity: bgImageOpacity,
                },
              ]}
              resizeMode="cover"
            />
          </View>
          <Animated.View
            style={[
              styles.content,
              { transform: [{ translateY: contentTranslateY }] },
            ]}
          >
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{t(error)}</Text>
              </View>
            )}

            <CustomTextInput
              placeholder={t("changePassword.oldPassword")}
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry
              leftIcon="lock-closed-outline"
              onFocus={handleInputFocus}
            />
            <CustomTextInput
              placeholder={t("changePassword.newPassword")}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              leftIcon="lock-closed-outline"
              onFocus={handleInputFocus}
            />
            <CustomTextInput
              placeholder={t("changePassword.confirmPassword")}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              leftIcon="lock-closed-outline"
              onFocus={handleInputFocus}
            />
            <ButtonLoading
              onPress={handleChangePassword}
              title={t("changePassword.changePassword")}
              isLoading={isLoading}
            />
          </Animated.View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: heightScale(50),
  },

  content: {
    width: "100%",
    alignItems: "center",
    marginTop: heightScale(40),
    paddingHorizontal: widthScale(24),
  },
  errorContainer: {
    backgroundColor: Colors.errorBackground,
    borderColor: Colors.errorBorder,
    borderWidth: 1,
    borderRadius: widthScale(8),
    padding: widthScale(12),
    marginBottom: heightScale(16),
    width: widthScale(320),
  },
  errorText: {
    color: Colors.error,
    fontSize: fontScale(14),
    textAlign: "center",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: widthScale(4),
    paddingHorizontal: widthScale(16),
    paddingVertical: heightScale(20),
    paddingTop: heightScale(60),
  },
  title: {
    fontSize: fontScale(24),
    fontWeight: "bold",
    color: Colors.primaryText,
  },
  bgImage: {
    height: heightScale(100),
    width: widthScale(100),
  },
  passwordContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
