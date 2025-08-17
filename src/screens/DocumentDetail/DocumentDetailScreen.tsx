import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "constants/colors";
import { widthScale, heightScale, fontScale, SCREEN_HEIGHT } from "utils/scale";
import { useTranslation } from "react-i18next";
import { RootStackNavigationProp } from "@navigation/type";
import { useDocumentDetail } from "./useDocumentDetail";
import { createVideoUrl } from "utils/videoUrl";
import ExpoVideoPlayer from "@components/ExpoVideoPlayer";
import TranslationLoadingOverlay from "@components/TranslationLoadingOverlay";
import navigatorName from "constants/navigatorName";

export default function DocumentDetailScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<RootStackNavigationProp>();
  const {
    isLoading,
    data,
    error,
    handleCreateSummary,
    isCreatingSummary,
    isTranslating,
  } = useDocumentDetail();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleChatPress = () => {
    if (data) {
      navigation.navigate("RecordDetail", {
        record: data,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={fontScale(24)}
            color={Colors.primaryText}
          />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {data?.title || t("documentDetail.title")}
          </Text>
        </View>
        {/* Hide info button when translating */}
        {!isTranslating && (
          <TouchableOpacity onPress={handleChatPress} style={styles.chatButton}>
            <Ionicons
              name="information-circle"
              size={fontScale(24)}
              color={Colors.primaryText}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primaryButton} />
            <Text style={styles.loadingText}>
              {t("documentDetail.loading")}
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons
              name="alert-circle"
              size={fontScale(48)}
              color={Colors.error}
            />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : data ? (
          <>
            {/* Video Player */}
            <View style={styles.videoContainer}>
              {data?.recordUri ? (
                <ExpoVideoPlayer
                  uri={createVideoUrl(data.recordUri)}
                  translations={data.translationAI}
                />
              ) : (
                <View style={styles.videoPlayer}>
                  <View style={styles.videoPlaceholder}>
                    <Ionicons
                      name="play-circle"
                      size={fontScale(64)}
                      color={Colors.white}
                    />
                    <Text style={styles.videoPlaceholderText}>
                      {t("documentDetail.noVideo")}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Summary Section */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>
                {t("documentDetail.summary")}
              </Text>
              {data.summary ? (
                <ScrollView
                  style={styles.content}
                  contentContainerStyle={styles.contentContainer}
                >
                  <Text style={styles.summaryText}>{data.summary}</Text>
                </ScrollView>
              ) : (
                <TouchableOpacity
                  style={styles.createSummaryButton}
                  onPress={handleCreateSummary}
                  disabled={isCreatingSummary}
                >
                  {isCreatingSummary ? (
                    <ActivityIndicator
                      size="small"
                      color={Colors.primaryButton}
                    />
                  ) : (
                    <Ionicons
                      name="add-circle"
                      size={fontScale(20)}
                      color={Colors.primaryButton}
                    />
                  )}
                  <Text style={styles.createSummaryText}>
                    {isCreatingSummary
                      ? t("documentDetail.creatingSummary")
                      : t("documentDetail.createSummary")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              {t("documentDetail.comingSoon")}
            </Text>
            <Text style={styles.placeholderSubtext}>
              {t("documentDetail.description")}
            </Text>
          </View>
        )}
      </View>

      {/* Translation Loading Overlay */}
      <TranslationLoadingOverlay
        isVisible={isTranslating}
        onBackPress={handleBackPress}
      />
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
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: heightScale(4),
  },
  liveIndicator: {
    width: widthScale(8),
    height: widthScale(8),
    borderRadius: widthScale(4),
    backgroundColor: Colors.error,
    marginRight: widthScale(6),
  },
  durationText: {
    fontSize: fontScale(12),
    color: Colors.primaryText,
    fontWeight: "500",
  },
  chatButton: {},
  chatNotification: {
    position: "absolute",
    top: widthScale(4),
    right: widthScale(4),
    width: widthScale(6),
    height: widthScale(6),
    borderRadius: widthScale(3),
    backgroundColor: Colors.success,
  },
  backButton: {
    padding: widthScale(8),
  },
  headerTitle: {
    fontSize: fontScale(18),
    fontWeight: "600",
    color: Colors.primaryText,
    textAlign: "center",
  },
  headerRight: {
    width: widthScale(40),
    alignItems: "flex-end",
  },
  actionButton: {
    padding: widthScale(8),
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: heightScale(20),
  },
  documentInfo: {
    alignItems: "center",
    paddingVertical: heightScale(40),
    paddingHorizontal: widthScale(20),
  },
  documentIcon: {
    width: widthScale(80),
    height: widthScale(80),
    borderRadius: widthScale(40),
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: heightScale(16),
    borderWidth: 2,
    borderColor: Colors.border,
  },
  documentTitle: {
    fontSize: fontScale(24),
    fontWeight: "bold",
    color: Colors.primaryText,
    marginBottom: heightScale(8),
  },
  documentSubtitle: {
    fontSize: fontScale(16),
    color: Colors.secondaryText,
    textAlign: "center",
  },
  placeholderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: widthScale(40),
    paddingVertical: heightScale(60),
  },
  placeholderText: {
    fontSize: fontScale(20),
    fontWeight: "600",
    color: Colors.primaryText,
    marginBottom: heightScale(12),
    textAlign: "center",
  },
  placeholderSubtext: {
    fontSize: fontScale(16),
    color: Colors.secondaryText,
    textAlign: "center",
    lineHeight: fontScale(24),
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: heightScale(60),
  },
  loadingText: {
    marginTop: heightScale(16),
    fontSize: fontScale(16),
    color: Colors.secondaryText,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: heightScale(60),
  },
  errorText: {
    marginTop: heightScale(16),
    fontSize: fontScale(16),
    color: Colors.error,
    textAlign: "center",
  },
  detailsContainer: {
    paddingHorizontal: widthScale(20),
    paddingVertical: heightScale(20),
  },
  sectionTitle: {
    fontSize: fontScale(18),
    fontWeight: "600",
    color: Colors.primaryText,
    marginBottom: heightScale(16),
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: heightScale(12),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    fontSize: fontScale(16),
    color: Colors.secondaryText,
  },
  detailValue: {
    fontSize: fontScale(16),
    color: Colors.primaryText,
    fontWeight: "500",
  },
  videoContainer: {
    position: "relative",
    width: "100%",
    height: SCREEN_HEIGHT * 0.3,
    backgroundColor: Colors.darkGray,
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.primaryText,
    borderRadius: widthScale(12),
    overflow: "hidden",
    position: "relative",
  },
  videoPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  videoPlaceholderText: {
    color: Colors.white,
    fontSize: fontScale(16),
    marginTop: heightScale(12),
  },
  fullscreenButton: {
    position: "absolute",
    top: widthScale(16),
    right: widthScale(16),
    padding: widthScale(8),
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: widthScale(20),
  },
  subtitleContainer: {
    position: "absolute",
    bottom: widthScale(16),
    left: widthScale(16),
    right: widthScale(16),
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: widthScale(8),
    padding: widthScale(12),
  },
  subtitleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: heightScale(4),
  },
  subtitleLabel: {
    color: Colors.white,
    fontSize: fontScale(12),
    fontWeight: "600",
    marginRight: widthScale(6),
  },
  subtitleText: {
    color: Colors.white,
    fontSize: fontScale(14),
    lineHeight: fontScale(20),
  },
  summaryContainer: {
    margin: widthScale(20),
    padding: widthScale(16),
    height: SCREEN_HEIGHT * 0.5,
    backgroundColor: Colors.white,
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
  summaryTitle: {
    fontSize: fontScale(18),
    fontWeight: "600",
    color: Colors.primaryText,
    marginBottom: heightScale(12),
  },
  summaryText: {
    fontSize: fontScale(16),
    color: Colors.secondaryText,
    lineHeight: fontScale(24),
  },
  createSummaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: heightScale(16),
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: "dashed",
    borderRadius: widthScale(8),
  },
  createSummaryText: {
    fontSize: fontScale(16),
    color: Colors.primaryButton,
    marginLeft: widthScale(8),
    fontWeight: "500",
  },
});
