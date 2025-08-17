import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { fontScale, widthScale, heightScale } from "utils/scale";
import { Colors } from "constants/colors";
import { useJoinMeeting } from "./useJoinMeeting";
import AdmitAccessPrompt from "components/AdmitAccessPrompt";
import { useNavigation } from "@react-navigation/native";
import { convertSecondsToTime } from "utils/time";

interface JoinMeetingScreenProps {
  route: {
    params: {
      meetingId: string;
      platform: string;
      meetingCode: string;
    };
  };
}

export default function JoinMeetingScreen({ route }: JoinMeetingScreenProps) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { meetingId, meetingCode, platform } = route.params;
  const {
    recordDetails,
    messages,
    transcript,
    isLoading,
    handleStopMeeting,
    isStopping,
  } = useJoinMeeting(meetingId);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primaryButton} />
          <Text style={styles.loadingText}>{t("joinMeeting.loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderMessage = ({ item }: { item: any }) => (
    <View style={styles.messageItem}>
      <Text style={styles.messageSender}>{item.sender}</Text>
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={styles.messageTime}>
        {" "}
        {convertSecondsToTime(item.time / 1000)}
      </Text>
    </View>
  );

  const renderTranscript = ({ item }: { item: any }) => (
    <View style={styles.transcriptItem}>
      <Text style={styles.transcriptText}>{item.transcript}</Text>
      <Text style={styles.transcriptTime}>
        {convertSecondsToTime(item.time / 1000)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={fontScale(24)}
            color={Colors.primaryText}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("joinMeeting.title")}</Text>
        <TouchableOpacity onPress={handleStopMeeting} style={styles.stopButton}>
          {isStopping ? (
            <ActivityIndicator size="small" color={Colors.error} />
          ) : (
            <Ionicons
              name="stop-circle"
              size={fontScale(24)}
              color={Colors.error}
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Meeting Info */}
        <View style={styles.meetingInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {t("joinMeeting.meetingCode")}:
            </Text>
            <Text style={styles.infoValue}>{meetingCode}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t("joinMeeting.platform")}:</Text>
            <Text style={styles.infoValue}>{platform}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t("joinMeeting.organizer")}:</Text>
            <Text style={styles.infoValue}>
              {recordDetails?.organizer || "N/A"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t("joinMeeting.createdAt")}:</Text>
            <Text style={styles.infoValue}>
              {recordDetails?.createdAt
                ? new Date(recordDetails?.createdAt).toLocaleString()
                : "N/A"}
            </Text>
          </View>
        </View>

        {/* Translation AI Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="mic"
              size={fontScale(20)}
              color={Colors.primaryButton}
            />
            <Text style={styles.sectionTitle}>
              {t("joinMeeting.transcription")}
            </Text>
          </View>
          <View style={styles.transcriptContainer}>
            <FlatList
              data={transcript}
              renderItem={renderTranscript}
              keyExtractor={(item) => item.time}
              showsVerticalScrollIndicator={false}
              style={styles.transcriptList}
            />
          </View>
        </View>

        {/* Messages Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="chatbubbles"
              size={fontScale(20)}
              color={Colors.primaryButton}
            />
            <Text style={styles.sectionTitle}>{t("joinMeeting.messages")}</Text>
          </View>
          <View style={styles.messagesContainer}>
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item, index) => `${item.time}-message-${index}`}
              showsVerticalScrollIndicator={false}
              style={styles.messagesList}
            />
          </View>
        </View>
      </View>

      {recordDetails?.joiningStatus && (
        <AdmitAccessPrompt
          status={recordDetails?.joiningStatus}
          platform={recordDetails?.platform}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: widthScale(20),
    paddingVertical: heightScale(16),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: widthScale(8),
  },
  headerTitle: {
    fontSize: fontScale(18),
    fontWeight: "bold",
    color: Colors.primaryText,
    flex: 1,
    textAlign: "center",
  },
  stopButton: {
    padding: widthScale(8),
  },
  content: {
    flex: 1,
    paddingHorizontal: widthScale(20),
    paddingTop: heightScale(20),
  },
  meetingInfo: {
    backgroundColor: Colors.white,
    borderRadius: widthScale(12),
    padding: widthScale(16),
    marginBottom: heightScale(20),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: heightScale(8),
  },
  infoLabel: {
    fontSize: fontScale(14),
    color: Colors.secondaryText,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: fontScale(14),
    color: Colors.primaryText,
    fontWeight: "600",
  },
  section: {
    flex: 1,
    marginBottom: heightScale(20),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: heightScale(12),
  },
  sectionTitle: {
    fontSize: fontScale(16),
    fontWeight: "bold",
    color: Colors.primaryText,
    marginLeft: widthScale(8),
  },
  transcriptContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: widthScale(12),
    padding: widthScale(12),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  transcriptList: {
    flex: 1,
  },
  transcriptItem: {
    paddingVertical: heightScale(8),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + "30",
  },
  transcriptText: {
    fontSize: fontScale(14),
    color: Colors.primaryText,
    lineHeight: fontScale(20),
  },
  transcriptTime: {
    fontSize: fontScale(12),
    color: Colors.secondaryText,
    marginTop: heightScale(4),
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: widthScale(12),
    padding: widthScale(12),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messagesList: {
    flex: 1,
  },
  messageItem: {
    paddingVertical: heightScale(8),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + "30",
  },
  messageSender: {
    fontSize: fontScale(12),
    color: Colors.primaryButton,
    fontWeight: "600",
    marginBottom: heightScale(4),
  },
  messageText: {
    fontSize: fontScale(14),
    color: Colors.primaryText,
    lineHeight: fontScale(20),
  },
  messageTime: {
    fontSize: fontScale(12),
    color: Colors.secondaryText,
    marginTop: heightScale(4),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: widthScale(40),
  },
  loadingText: {
    fontSize: fontScale(18),
    fontWeight: "600",
    color: Colors.primaryText,
    marginTop: heightScale(20),
    textAlign: "center",
  },
});
