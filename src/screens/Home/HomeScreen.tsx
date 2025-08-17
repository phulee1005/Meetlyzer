import React from "react";
import { StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { Colors } from "constants/colors";
import Header from "components/Header";
import StreamingCard from "components/StreamingCard";
import ActionButtons from "components/ActionButtons";
import ComingSection from "components/ComingSection";
import UploadModal from "components/UploadModal";
import JoinLiveModal from "components/JoinLiveModal";
import GoogleCalendarModal from "components/GoogleCalendarModal";
import { heightScale } from "utils/scale";
import { useHomeScreen } from "./useHomeScreen";

export default function HomeScreen() {
  const {
    streamingData,
    actionItems,
    showUploadModal,
    showJoinLiveModal,
    showGoogleCalendarModal,
    googleCalendarData,
    isGoogleCalendarRegistered,
    handleStreamingItemPress,
    handleExpertItemPress,
    handleUploadModalClose,
    handleUpload,
    handleJoinLiveModalClose,
    handleJoinLiveModalReset,
    handleJoinLive,
    handleJoinLivePressFromEmpty,
    handleGoogleCalendarModalClose,
    handleToggleGoogleCalendar,
    isUploading,
    isJoining,
    isRegistering,
    isUnregistering,
    progress,
    success,
  } = useHomeScreen();

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <StreamingCard
          data={streamingData}
          onPress={handleStreamingItemPress}
          onEmptyPress={handleJoinLivePressFromEmpty}
        />
        <ActionButtons actions={actionItems} />
        <ComingSection
          experts={googleCalendarData?.list || []}
          onExpertPress={handleExpertItemPress}
          isGoogleCalendarRegistered={isGoogleCalendarRegistered}
          onRegisterGoogleCalendar={handleToggleGoogleCalendar}
        />
      </ScrollView>

      {/* Upload Modal */}
      <UploadModal
        visible={showUploadModal}
        onClose={handleUploadModalClose}
        onUpload={handleUpload}
        isUploading={isUploading}
        progress={progress}
        clearFileOnComplete={true}
        uploadSuccess={success}
        onClearFile={() => {
          // This will be called when file is cleared
        }}
      />

      {/* Join Live Modal */}
      <JoinLiveModal
        visible={showJoinLiveModal}
        onClose={handleJoinLiveModalClose}
        onReset={handleJoinLiveModalReset}
        onJoin={handleJoinLive}
        isLoading={isJoining}
      />

      {/* Google Calendar Modal */}
      <GoogleCalendarModal
        visible={showGoogleCalendarModal}
        onClose={handleGoogleCalendarModalClose}
        isRegistered={googleCalendarData?.registerGoogleCalendar || false}
        isLoading={isRegistering || isUnregistering}
        onToggleRegistration={handleToggleGoogleCalendar}
      />
    </SafeAreaView>
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
  contentContainer: {
    paddingBottom: heightScale(20),
  },
});
