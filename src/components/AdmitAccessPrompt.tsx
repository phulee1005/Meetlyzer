import React from "react";
import { View, Text, StyleSheet, Modal, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { fontScale, widthScale, heightScale } from "utils/scale";
import { Colors } from "constants/colors";
import { JOINING_STATUS, PLATFORM } from "types/record";

interface AdmitAccessPromptProps {
  status: JOINING_STATUS;
  platform?: string;
}

export default function AdmitAccessPrompt({
  status,
  platform,
}: AdmitAccessPromptProps) {
  const { t } = useTranslation();

  // Xác định current step
  const getCurrentStep = () => {
    switch (status) {
      case JOINING_STATUS.NEW:
        return 1;
      case JOINING_STATUS.PROCESSING:
        return 2;
      case JOINING_STATUS.WATING_FOR_ADMIT:
        return 3;
      default:
        return 1;
    }
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case PLATFORM.google:
        return "logo-google";
      case PLATFORM.zoom:
        return "videocam";
      case PLATFORM.mst:
        return "logo-microsoft";
      default:
        return "videocam";
    }
  };

  const getPlatformName = () => {
    switch (platform) {
      case PLATFORM.google:
        return "Google Meet";
      case PLATFORM.zoom:
        return "Zoom";
      case PLATFORM.mst:
        return "Microsoft Teams";
      default:
        return "Meeting";
    }
  };

  return (
    <Modal
      transparent
      visible={
        status !== JOINING_STATUS.DONE && status !== JOINING_STATUS.FAILED
      }
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Platform Logo */}
          <View style={styles.platformContainer}>
            <View style={styles.platformIconContainer}>
              <Ionicons
                name={getPlatformIcon() as any}
                size={fontScale(32)}
                color={Colors.primaryButton}
              />
            </View>
            <Text style={styles.platformName}>{getPlatformName()}</Text>
          </View>

          {/* Steps */}
          <View style={styles.stepsContainer}>
            <View style={styles.stepRow}>
              <View
                style={[
                  styles.stepCircle,
                  getCurrentStep() >= 1 && styles.stepActive,
                ]}
              >
                {getCurrentStep() > 1 ? (
                  <Ionicons
                    name="checkmark"
                    size={fontScale(16)}
                    color={Colors.white}
                  />
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      getCurrentStep() >= 1 && styles.stepNumberActive,
                    ]}
                  >
                    1
                  </Text>
                )}
              </View>
              <View
                style={[
                  styles.stepLine,
                  getCurrentStep() > 1 && styles.stepLineActive,
                ]}
              />
              <View
                style={[
                  styles.stepCircle,
                  getCurrentStep() >= 2 && styles.stepActive,
                ]}
              >
                {getCurrentStep() > 2 ? (
                  <Ionicons
                    name="checkmark"
                    size={fontScale(16)}
                    color={Colors.white}
                  />
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      getCurrentStep() >= 2 && styles.stepNumberActive,
                    ]}
                  >
                    2
                  </Text>
                )}
              </View>
              <View
                style={[
                  styles.stepLine,
                  getCurrentStep() > 2 && styles.stepLineActive,
                ]}
              />
              <View
                style={[
                  styles.stepCircle,
                  getCurrentStep() >= 3 && styles.stepActive,
                ]}
              >
                {getCurrentStep() > 3 ? (
                  <Ionicons
                    name="checkmark"
                    size={fontScale(16)}
                    color={Colors.white}
                  />
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      getCurrentStep() >= 3 && styles.stepNumberActive,
                    ]}
                  >
                    3
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.stepLabels}>
              <Text
                style={[
                  styles.stepLabel,
                  getCurrentStep() >= 1 && styles.stepLabelActive,
                ]}
              >
                {t("joinMeeting.steps.queue")}
              </Text>
              <Text
                style={[
                  styles.stepLabel,
                  getCurrentStep() >= 2 && styles.stepLabelActive,
                ]}
              >
                {t("joinMeeting.steps.processing")}
              </Text>
              <Text
                style={[
                  styles.stepLabel,
                  getCurrentStep() >= 3 && styles.stepLabelActive,
                ]}
              >
                {t("joinMeeting.steps.access")}
              </Text>
            </View>
          </View>

          {/* Current Status */}
          <View style={styles.statusContainer}>
            {status === JOINING_STATUS.NEW && (
              <View style={styles.content}>
                <Text style={styles.title}>
                  {t("joinMeeting.steps.queueTitle")}
                </Text>
                <Text style={styles.subtitle}>
                  {t("joinMeeting.steps.queueSubtitle")}
                </Text>
                <ActivityIndicator
                  size="large"
                  color={Colors.primaryButton}
                  style={styles.loading}
                />
              </View>
            )}

            {status === JOINING_STATUS.PROCESSING && (
              <View style={styles.content}>
                <Text style={styles.title}>
                  {t("joinMeeting.steps.processingTitle")}
                </Text>
                <Text style={styles.subtitle}>
                  {t("joinMeeting.steps.processingSubtitle")}
                </Text>
                <ActivityIndicator
                  size="large"
                  color={Colors.primaryButton}
                  style={styles.loading}
                />
              </View>
            )}

            {status === JOINING_STATUS.WATING_FOR_ADMIT && (
              <View style={styles.content}>
                <Text style={styles.title}>
                  {t("joinMeeting.steps.accessTitle")}
                </Text>
                <Text style={styles.subtitle}>
                  {t("joinMeeting.steps.accessSubtitle")}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: widthScale(16),
    padding: widthScale(40),
    marginHorizontal: widthScale(20),
    maxWidth: widthScale(400),
    shadowColor: Colors.primaryText,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  platformContainer: {
    alignItems: "center",
    marginBottom: heightScale(24),
  },
  platformIconContainer: {
    width: widthScale(60),
    height: widthScale(60),
    borderRadius: widthScale(30),
    backgroundColor: Colors.primaryButton + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: heightScale(8),
  },
  platformName: {
    fontSize: fontScale(18),
    fontWeight: "600",
    color: Colors.primaryText,
  },
  stepsContainer: {
    marginBottom: heightScale(24),
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: heightScale(12),
  },
  stepCircle: {
    width: widthScale(32),
    height: widthScale(32),
    borderRadius: widthScale(16),
    backgroundColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  stepActive: {
    backgroundColor: Colors.primaryButton,
  },
  stepNumber: {
    fontSize: fontScale(14),
    fontWeight: "bold",
    color: Colors.secondaryText,
  },
  stepNumberActive: {
    color: Colors.white,
  },
  stepLine: {
    width: widthScale(40),
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: widthScale(8),
  },
  stepLineActive: {
    backgroundColor: Colors.primaryButton,
  },
  stepLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: widthScale(10),
    alignItems: "center",
  },
  stepLabel: {
    fontSize: fontScale(12),
    color: Colors.secondaryText,
    textAlign: "center",
    flex: 1,
    paddingHorizontal: widthScale(4),
  },
  stepLabelActive: {
    color: Colors.primaryButton,
    fontWeight: "600",
  },
  statusContainer: {
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: fontScale(20),
    fontWeight: "bold",
    color: Colors.primaryText,
    textAlign: "center",
    marginBottom: heightScale(8),
  },
  subtitle: {
    fontSize: fontScale(14),
    color: Colors.secondaryText,
    textAlign: "center",
    marginBottom: heightScale(20),
    lineHeight: fontScale(20),
  },
  loading: {
    marginTop: heightScale(16),
  },
});
