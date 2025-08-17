import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { fontScale, widthScale, heightScale } from "utils/scale";
import { Ionicons } from "@expo/vector-icons";
import Images from "assets/images";
import ButtonLoading from "components/Button";
import { useTranslation } from "react-i18next";
import CustomTextInput from "components/TextInput";
import { useKeyboardAnimation } from "hooks/useKeyboardAnimation";
import { Colors } from "constants/colors";
import { useLogin } from "./useLogin";
import { RootStackParamList } from "@navigation/type";
import { showInfo } from "@components/CustomModal";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {
    bgImageTranslateY,
    bgImageOpacity,
    contentTranslateY,
    handleInputFocus,
    handleInputBlur,
  } = useKeyboardAnimation();

  const { login, googleLogin, isLoading, error, clearError, validateForm } =
    useLogin();

  const handleLogin = async () => {
    // Clear previous error
    clearError();

    // Validate form
    const validationError = validateForm(email, password);
    if (validationError) {
      Alert.alert(t("validation.validationFailed"), validationError);
      return;
    }

    // Attempt login
    const success = await login({ email, password });
    if (!success) {
      // Error is already set in the hook
      return;
    }
  };

  const handleGoogleLogin = async () => {
    // Clear previous error
    clearError();

    // Attempt Google login
    const success = await googleLogin();
    console.log("success", success);
    // if (!success) {
    //   // Error is already set in the hook
    //   return;
    // }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Animated.Image
          source={Images.background_signin}
          style={[
            styles.bgImage,
            {
              transform: [{ translateY: bgImageTranslateY }],
              opacity: bgImageOpacity,
            },
          ]}
          resizeMode="cover"
        />
        <ScrollView
          scrollEnabled={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.content,
              { transform: [{ translateY: contentTranslateY }] },
            ]}
          >
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{t(`validation.${error}`)}</Text>
              </View>
            )}

            <CustomTextInput
              placeholder={t("login.email")}
              value={email}
              onChangeText={setEmail}
              leftIcon="mail-outline"
              keyboardType="email-address"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            <CustomTextInput
              placeholder={t("login.password")}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              leftIcon="lock-closed-outline"
              rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowPassword(!showPassword)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => {
                showInfo(t("modal.featureComingSoon"), t("modal.info"));
              }}
            >
              <Text style={styles.forgotText}>{t("login.forgotPassword")}</Text>
            </TouchableOpacity>
            <ButtonLoading
              onPress={handleLogin}
              title={t("login.loginButton")}
              isLoading={isLoading}
            />
            <Text style={styles.orText}>{t("login.or")}</Text>
            <View style={styles.socialRow}>
              <TouchableOpacity
                style={[
                  styles.socialBtn,
                  isLoading && styles.socialBtnDisabled,
                ]}
                onPress={handleGoogleLogin}
                disabled={isLoading}
              >
                <Ionicons
                  name="logo-google"
                  size={fontScale(22)}
                  color={isLoading ? Colors.secondaryText : Colors.google}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>
                {t("login.dontHaveAccount")}{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.signupLink}>{t("login.signUp")}</Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: heightScale(320),
    paddingBottom: heightScale(50),
  },
  bgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: heightScale(320),
  },
  content: {
    width: "100%",
    alignItems: "center",
    marginTop: heightScale(40),
    paddingHorizontal: widthScale(24),
  },
  contentKeyboardVisible: {
    marginTop: heightScale(120),
  },
  title: {
    fontSize: fontScale(28),
    fontWeight: "bold",
    marginBottom: heightScale(30),
    color: Colors.primaryText,
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
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: heightScale(24),
  },
  forgotText: {
    color: Colors.primaryText,
    fontSize: fontScale(13),
    fontWeight: "500",
  },
  loginBtn: {
    width: widthScale(320),
    height: heightScale(48),
    backgroundColor: Colors.primaryButton,
    borderRadius: widthScale(24),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: heightScale(18),
  },
  loginText: {
    color: Colors.primaryButtonText,
    fontSize: fontScale(18),
    fontWeight: "bold",
  },
  orText: {
    color: Colors.secondaryText,
    fontSize: fontScale(14),
    marginVertical: heightScale(10),
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: heightScale(18),
  },
  socialBtn: {
    marginHorizontal: widthScale(5),
    backgroundColor: Colors.white,
    borderRadius: widthScale(20),
    padding: widthScale(10),
    elevation: 2,
  },
  socialBtnSecondary: {
    marginHorizontal: widthScale(5),
    backgroundColor: Colors.primaryButton,
    borderRadius: widthScale(20),
    padding: widthScale(10),
    elevation: 2,
  },
  socialBtnDisabled: {
    opacity: 0.5,
  },
  signupRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: heightScale(10),
  },
  signupText: {
    color: Colors.secondaryText,
    fontSize: fontScale(14),
  },
  signupLink: {
    color: Colors.link,
    fontWeight: "bold",
    fontSize: fontScale(14),
  },
});
