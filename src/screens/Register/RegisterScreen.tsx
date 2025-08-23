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
import { useRegister } from "./useRegister";
import { RootStackParamList } from "@navigation/type";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {
    bgImageTranslateY,
    bgImageOpacity,
    contentTranslateY,
    handleInputFocus,
  } = useKeyboardAnimation({
    autoListenKeyboard: true,
  });

  const { register, isLoading, error, clearError, validateForm } =
    useRegister();

  const handleRegister = async () => {
    // Clear previous error
    clearError();

    // Validate form
    const validationError = validateForm(name, email, password);
    if (validationError) {
      Alert.alert(t("validation.validationFailed"), validationError);
      return;
    }

    // Attempt login
    const success = await register({ name, email, password });
    if (!success) {
      return;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Animated.Image
          source={Images.background_signup}
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
              placeholder={t("register.email")}
              value={email}
              onChangeText={setEmail}
              leftIcon="mail-outline"
              keyboardType="email-address"
              onFocus={handleInputFocus}
            />
            <CustomTextInput
              placeholder={t("register.name")}
              value={name}
              onChangeText={setName}
              leftIcon="person-outline"
              onFocus={handleInputFocus}
            />
            <CustomTextInput
              placeholder={t("register.password")}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              leftIcon="lock-closed-outline"
              rightIcon={showPassword ? "eye-off-outline" : "eye-outline"}
              onRightIconPress={() => setShowPassword(!showPassword)}
              onFocus={handleInputFocus}
            />

            <ButtonLoading
              onPress={handleRegister}
              title={t("register.registerButton")}
              isLoading={isLoading}
            />
            <Text style={styles.orText}>{t("login.or")}</Text>
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons
                  name="logo-google"
                  size={fontScale(22)}
                  color={Colors.google}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>
                {t("register.alreadyHaveAccount")}{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.signupLink}>{t("register.signIn")}</Text>
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
    marginRight: widthScale(32),
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
    marginHorizontal: widthScale(10),
    backgroundColor: Colors.white,
    borderRadius: widthScale(20),
    padding: widthScale(10),
    elevation: 2,
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
