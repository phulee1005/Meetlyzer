import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { widthScale, heightScale, fontScale } from "utils/scale";
import { Colors } from "constants/colors";
import { useTranslation } from "react-i18next";
import { PLATFORM, RecordMeeting } from "types/record";

interface StreamingCardProps {
  data: RecordMeeting[];
  onPress: (item: RecordMeeting) => void;
  onEmptyPress?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - widthScale(40); // Full width minus padding

// Individual streaming item component
const StreamingItemComponent = ({
  item,
  onPress,
}: {
  item: RecordMeeting;
  onPress: () => void;
}) => {
  const { t } = useTranslation();

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get platform icon
  const getPlatformIcon = () => {
    switch (item.platform) {
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

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={styles.itemContent}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons
                name={getPlatformIcon() as any}
                size={24}
                color={Colors.white}
              />
            </View>
            {item.recording && <View style={styles.liveIndicator} />}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{item.title || item.meetingCode}</Text>
            <View style={styles.icon}>
              <Ionicons name="pulse" size={16} color={Colors.white} />
              <Text style={styles.description}>{t("home.onStream")}</Text>
            </View>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="time" size={16} color={Colors.white} />
            <Text style={styles.detailText}>{formatDate(item.createdAt)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="person" size={16} color={Colors.white} />
            <Text style={styles.detailText}>{item.organizer}</Text>
          </View>
        </View>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="link" size={16} color={Colors.white} />
            <Text
              style={styles.detailText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.meetingCode}
            </Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color={Colors.white} />
    </TouchableOpacity>
  );
};

// Dots indicator component
const DotsIndicator = ({
  total,
  current,
}: {
  total: number;
  current: number;
}) => {
  if (total <= 1) return null;

  return (
    <View style={styles.dotsContainer}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === current ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};

export default function StreamingCard({
  data,
  onPress,
  onEmptyPress,
}: StreamingCardProps) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const renderItem = ({ item }: { item: RecordMeeting }) => (
    <StreamingItemComponent item={item} onPress={() => onPress(item)} />
  );

  const keyExtractor = (item: RecordMeeting) => item._id;

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / CARD_WIDTH);
    setCurrentIndex(index);
  };

  // Empty state component
  const EmptyState = () => (
    <TouchableOpacity style={styles.emptyContainer} onPress={onEmptyPress}>
      <View style={styles.emptyContent}>
        <Ionicons
          name="videocam-outline"
          size={48}
          color={Colors.secondaryText}
        />
        <Text style={styles.emptyTitle}>{t("home.noStreamingMeetings")}</Text>
        <Text style={styles.emptySubtitle}>{t("home.joinFirstMeeting")}</Text>
        <View style={styles.emptyButton}>
          <Ionicons name="add-circle" size={20} color={Colors.primaryButton} />
          <Text style={styles.emptyButtonText}>{t("home.joinLive")}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t("home.onStream")}</Text>
      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            pagingEnabled={true}
            snapToInterval={CARD_WIDTH + widthScale(12)} // Card width + separator
            decelerationRate="fast"
          />
          <DotsIndicator total={data.length} current={currentIndex} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: widthScale(20),
    marginVertical: heightScale(10),
  },
  sectionTitle: {
    fontSize: fontScale(18),
    fontWeight: "bold",
    color: Colors.primaryText,
    marginBottom: heightScale(12),
  },
  listContainer: {
    paddingRight: widthScale(20),
  },
  itemContainer: {
    backgroundColor: Colors.blue,
    borderRadius: widthScale(16),
    padding: widthScale(20),
    marginVertical: heightScale(5),
    flexDirection: "row",
    alignItems: "center",
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: CARD_WIDTH, // Full screen width
  },
  itemContent: {
    flex: 1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: heightScale(12),
  },
  avatar: {
    position: "relative",
    marginRight: widthScale(12),
  },
  avatarImage: {
    width: widthScale(48),
    height: widthScale(48),
    borderRadius: widthScale(24),
  },
  avatarPlaceholder: {
    width: widthScale(48),
    height: widthScale(48),
    borderRadius: widthScale(24),
    backgroundColor: Colors.primaryButton,
    justifyContent: "center",
    alignItems: "center",
  },
  liveIndicator: {
    position: "absolute",
    top: -widthScale(2),
    right: -widthScale(2),
    width: widthScale(12),
    height: widthScale(12),
    borderRadius: widthScale(6),
    backgroundColor: Colors.orange,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: fontScale(18),
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: heightScale(4),
  },
  description: {
    fontSize: fontScale(14),
    color: Colors.lightBlue,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: heightScale(4),
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: widthScale(6),
    flex: 1,
  },
  detailText: {
    fontSize: fontScale(12),
    color: Colors.lightBlue,
    flex: 1,
  },
  icon: {
    flexDirection: "row",
    alignItems: "center",
    gap: widthScale(4),
  },
  separator: {
    width: widthScale(12),
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: heightScale(16),
    gap: widthScale(8),
  },
  dot: {
    width: widthScale(8),
    height: widthScale(8),
    borderRadius: widthScale(4),
  },
  activeDot: {
    backgroundColor: Colors.blue,
  },
  inactiveDot: {
    backgroundColor: Colors.secondaryText,
  },
  emptyContainer: {
    backgroundColor: Colors.white,
    borderRadius: widthScale(16),
    padding: widthScale(24),
    marginVertical: heightScale(5),
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: heightScale(20),
  },
  emptyTitle: {
    fontSize: fontScale(18),
    fontWeight: "bold",
    color: Colors.primaryText,
    marginTop: heightScale(12),
    marginBottom: heightScale(8),
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: fontScale(14),
    color: Colors.secondaryText,
    textAlign: "center",
    marginBottom: heightScale(20),
    lineHeight: fontScale(20),
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryButton + "20",
    paddingHorizontal: widthScale(16),
    paddingVertical: heightScale(8),
    borderRadius: widthScale(20),
    gap: widthScale(8),
  },
  emptyButtonText: {
    fontSize: fontScale(14),
    fontWeight: "600",
    color: Colors.primaryButton,
  },
});
