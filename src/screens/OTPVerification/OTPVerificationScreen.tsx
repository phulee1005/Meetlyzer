import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
  TextInput,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { fontScale, widthScale, heightScale } from "utils/scale";
import { RootStackParamList } from "@navigation/type";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Colors } from "constants/colors";
import ButtonLoading from "components/Button";
import { showSuccess, showError } from "components/CustomModal";
import { useOTPVerification } from "./useOTPVerification";
import { useLogin } from "@screens/Login/useLogin";

type Props = NativeStackScreenProps<RootStackParamList, "OTPVerification">;

export default function OTPVerificationScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { email, password } = route.params;
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { verifyOTP, resendOTP, isLoading } = useOTPVerification();
  const { login } = useLogin();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      await resendOTP(email);
      setTimeLeft(60);
      setCanResend(false);
      showSuccess(t("otp.resendSuccess"));
    } catch (error) {
      showError(t("otp.resendError"));
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 5) {
      showError(t("otp.invalidOTP"));
      return;
    }

    try {
      const success = await verifyOTP(email, otpString);
      if (success) {
        showSuccess(t("otp.verificationSuccess"), t("otp.success"), () => {
          login({ email, password });
        });
      }
    } catch (error) {
      showError(t("otp.verificationError"));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={fontScale(24)}
              color={Colors.primaryText}
            />
          </TouchableOpacity>

          <View style={styles.header}>
            <Ionicons
              name="shield-checkmark"
              size={fontScale(80)}
              color={Colors.primaryButton}
              style={styles.icon}
            />
            <Text style={styles.title}>{t("otp.title")}</Text>
            <Text style={styles.subtitle}>{t("otp.subtitle", { email })}</Text>
          </View>

          <View style={styles.otpContainer}>
            <Text style={styles.otpLabel}>{t("otp.enterCode")}</Text>
            <View style={styles.otpInputs}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  style={styles.otpInput}
                  maxLength={1}
                  keyboardType="numeric"
                  textAlign="center"
                  autoFocus={index === 0}
                />
              ))}
            </View>
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              {t("otp.resendIn")} {formatTime(timeLeft)}
            </Text>
            <TouchableOpacity
              style={[
                styles.resendButton,
                !canResend && styles.resendButtonDisabled,
              ]}
              onPress={handleResendOTP}
              disabled={!canResend}
            >
              <Text
                style={[
                  styles.resendText,
                  !canResend && styles.resendTextDisabled,
                ]}
              >
                {t("otp.resend")}
              </Text>
            </TouchableOpacity>
          </View>

          <ButtonLoading
            title={t("otp.verify")}
            onPress={handleVerifyOTP}
            isLoading={isLoading}
          />

          <TouchableOpacity
            style={styles.backToLogin}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.backToLoginText}>{t("otp.backToLogin")}</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: widthScale(24),
    paddingTop: heightScale(60),
    paddingBottom: heightScale(40),
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: heightScale(20),
    left: widthScale(20),
    zIndex: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: heightScale(40),
  },
  icon: {
    marginBottom: heightScale(20),
  },
  title: {
    fontSize: fontScale(28),
    fontWeight: "bold",
    color: Colors.primaryText,
    marginBottom: heightScale(12),
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontScale(16),
    color: Colors.secondaryText,
    textAlign: "center",
    lineHeight: fontScale(24),
  },
  otpContainer: {
    width: "100%",
    marginBottom: heightScale(32),
  },
  otpLabel: {
    fontSize: fontScale(16),
    fontWeight: "600",
    color: Colors.primaryText,
    marginBottom: heightScale(16),
    textAlign: "center",
  },
  otpInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: widthScale(12),
  },
  otpInput: {
    width: widthScale(50),
    height: heightScale(60),
    fontSize: fontScale(24),
    fontWeight: "bold",
    textAlign: "center",
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: widthScale(12),
    backgroundColor: Colors.white,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: heightScale(32),
    gap: widthScale(16),
  },
  timerText: {
    fontSize: fontScale(14),
    color: Colors.secondaryText,
  },
  resendButton: {
    paddingHorizontal: widthScale(16),
    paddingVertical: heightScale(8),
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendText: {
    fontSize: fontScale(14),
    color: Colors.primaryButton,
    fontWeight: "600",
  },
  resendTextDisabled: {
    color: Colors.secondaryText,
  },
  backToLogin: {
    marginTop: heightScale(24),
  },
  backToLoginText: {
    fontSize: fontScale(14),
    color: Colors.secondaryText,
    textDecorationLine: "underline",
  },
});
