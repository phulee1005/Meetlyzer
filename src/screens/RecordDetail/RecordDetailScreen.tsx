import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "constants/colors";
import MessageItem from "components/MessageItem";
import TranscriptItem from "components/TranscriptItem";
import AnimatedTabBar from "components/AnimatedTabBar";
import { SCREEN_WIDTH } from "utils/scale";
import {
  JOINING_STATUS,
  MessageInMeeting,
  RecordMeeting,
  TranslationAI,
} from "types/record";
import { convertSecondsToTime } from "utils/time";
import { useTranslation } from "react-i18next";

interface RecordDetailScreenProps {
  route: {
    params: {
      record: RecordMeeting;
    };
  };
}

const RecordDetailScreen: React.FC<RecordDetailScreenProps> = ({ route }) => {
  const { t } = useTranslation();
  const { record } = route.params;
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  const [activeTab, setActiveTab] = useState(0);

  const renderMessage = useCallback(
    ({ item }: { item: MessageInMeeting }) => (
      <MessageItem
        sender={item.sender}
        content={item.message}
        timestamp={item.time}
      />
    ),
    []
  );

  const renderTranscript = useCallback(
    ({ item }: { item: TranslationAI }) => (
      <TranscriptItem
        speaker={item.speaker}
        content={item.transcript}
        timestamp={
          (item.start && convertSecondsToTime(item.start / 1000)) || "-"
        }
      />
    ),
    []
  );

  const renderChatTab = useCallback(
    () => (
      <View style={styles.tabContent}>
        <FlatList
          data={record.messagesInMeeting || []}
          renderItem={renderMessage}
          keyExtractor={(item) => item.time.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messageList}
        />
      </View>
    ),
    [record.messagesInMeeting, renderMessage]
  );

  const renderTranscriptTab = useCallback(
    () => (
      <View style={styles.tabContent}>
        <FlatList
          data={record.translationAI || []}
          renderItem={renderTranscript}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messageList}
        />
      </View>
    ),
    [record.translationAI, renderTranscript]
  );

  const tabData = [
    {
      id: "transcript",
      title: t("recordDetail.transcript"),
      render: renderTranscriptTab,
    },
    {
      id: "chat",
      title: t("recordDetail.chat"),
      render: renderChatTab,
    },
  ];

  const tabItems = tabData.map((tab) => ({
    id: tab.id,
    title: tab.title,
  }));

  const handleScroll = useCallback(
    (event: any) => {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const index = Math.round(scrollPosition / SCREEN_WIDTH);

      if (index !== activeTab && index >= 0 && index < tabData.length) {
        setActiveTab(index);
      }
    },
    [activeTab, tabData.length]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: SCREEN_WIDTH,
      offset: SCREEN_WIDTH * index,
      index,
    }),
    []
  );

  const renderTabContent = useCallback(
    ({
      item,
    }: {
      item: { id: string; title: string; render: () => React.JSX.Element };
    }) => (
      <View key={item.id} style={styles.tabContent}>
        {item.render()}
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: any) => item.id, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.contactName}>
            {record.joiningStatus === JOINING_STATUS.IMPORT
              ? t("home.import")
              : record.meetingCode}
          </Text>
          <View style={styles.timeContainer}>
            <Ionicons
              name="time-outline"
              size={16}
              color={Colors.secondaryText}
            />
            <Text style={styles.timeText}>
              {record.createdAt && new Date(record.createdAt).toLocaleString()}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Animated Tab Bar */}
      <AnimatedTabBar
        tabs={tabItems}
        activeIndex={activeTab}
        flatListRef={flatListRef}
        animationFirst={false}
        animationDelay={300}
      />

      {/* Content with Horizontal FlatList */}
      <FlatList
        ref={flatListRef}
        data={tabData}
        renderItem={renderTabContent}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
        initialScrollIndex={0}
        style={styles.contentFlatList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 5,
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  headerRight: {
    width: 34, // Same width as back button for balance
  },
  contactName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primaryText,
    marginBottom: 5,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginLeft: 5,
  },
  contentFlatList: {
    flex: 1,
  },
  tabContent: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  messageList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
});

export default RecordDetailScreen;
