import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { widthScale, heightScale, fontScale } from "utils/scale";
import { Colors } from "constants/colors";
import { useTranslation } from "react-i18next";
import { MeetingGoogleCalendar, PLATFORM } from "types/record";

interface ComingSectionProps {
  experts: MeetingGoogleCalendar[];
  onExpertPress: (expert: MeetingGoogleCalendar) => void;
  isGoogleCalendarRegistered?: boolean;
  onRegisterGoogleCalendar?: () => void;
}

// Empty state component when not registered
const EmptyStateComponent = ({ onRegister }: { onRegister: () => void }) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={styles.emptyCard} onPress={onRegister}>
      <View style={styles.emptyContent}>
        <View style={styles.emptyIcon}>
          <Ionicons
            name="calendar-outline"
            size={fontScale(48)}
            color={Colors.secondaryText}
          />
        </View>
        <Text style={styles.emptyTitle}>
          {t("home.comingSection.notConnected")}
        </Text>
        <Text style={styles.emptyDescription}>
          {t("home.comingSection.notConnectedDescription")}
        </Text>
        <View style={styles.connectButton}>
          <Ionicons
            name="add-circle"
            size={fontScale(20)}
            color={Colors.white}
          />
          <Text style={styles.connectButtonText}>
            {t("home.comingSection.connectCalendar")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Individual expert item component
const ExpertItemComponent = ({
  item,
  onPress,
}: {
  item: MeetingGoogleCalendar;
  onPress: () => void;
}) => {
  const { t } = useTranslation();

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
    //todo after detail and cancel join meeting
    <TouchableOpacity disabled={true} style={styles.card} onPress={onPress}>
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Ionicons
            name={getPlatformIcon() as any}
            size={fontScale(32)}
            color={Colors.primaryButton}
          />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{item.summary || ""}</Text>
          <View style={styles.detailItem}>
            <Ionicons name="time" size={16} color={Colors.darkGray} />
            <Text style={styles.description}>
              {t("home.openAt")}{" "}
              {item.startTime && new Date(item.startTime).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="link" size={16} color={Colors.orange} />
          <Text style={styles.ratingText}>{item.hangoutLink}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ComingSection({
  experts,
  onExpertPress,
  isGoogleCalendarRegistered = false,
  onRegisterGoogleCalendar,
}: ComingSectionProps) {
  const { t } = useTranslation();

  const renderItem = ({ item }: { item: MeetingGoogleCalendar }) => (
    <ExpertItemComponent item={item} onPress={() => onExpertPress(item)} />
  );

  const keyExtractor = (item: MeetingGoogleCalendar) => item.eventId;

  // Nếu chưa đăng ký Google Calendar, hiển thị empty state
  if (!isGoogleCalendarRegistered) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>{t("home.coming")}</Text>
        <EmptyStateComponent
          onRegister={onRegisterGoogleCalendar || (() => {})}
        />
      </View>
    );
  }

  // Nếu đã đăng ký nhưng không có cuộc họp nào
  if (experts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>{t("home.coming")}</Text>
        <View style={styles.noMeetingsCard}>
          <View style={styles.noMeetingsContent}>
            <Ionicons
              name="calendar-outline"
              size={fontScale(48)}
              color={Colors.secondaryText}
            />
            <Text style={styles.noMeetingsTitle}>
              {t("home.comingSection.noMeetings")}
            </Text>
            <Text style={styles.noMeetingsDescription}>
              {t("home.comingSection.noMeetingsDescription")}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t("home.coming")}</Text>
      <FlatList
        data={experts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        horizontal={false}
        scrollEnabled={false}
      />
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
    paddingBottom: heightScale(10),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: widthScale(16),
    padding: widthScale(20),
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
  emptyCard: {
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
  emptyIcon: {
    marginBottom: heightScale(16),
  },
  emptyTitle: {
    fontSize: fontScale(18),
    fontWeight: "600",
    color: Colors.primaryText,
    textAlign: "center",
    marginBottom: heightScale(8),
  },
  emptyDescription: {
    fontSize: fontScale(14),
    color: Colors.secondaryText,
    textAlign: "center",
    lineHeight: fontScale(20),
    marginBottom: heightScale(20),
  },
  connectButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryButton,
    paddingHorizontal: widthScale(20),
    paddingVertical: heightScale(12),
    borderRadius: widthScale(8),
  },
  connectButtonText: {
    fontSize: fontScale(16),
    fontWeight: "600",
    color: Colors.white,
    marginLeft: widthScale(8),
  },
  noMeetingsCard: {
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
  noMeetingsContent: {
    alignItems: "center",
    paddingVertical: heightScale(20),
  },
  noMeetingsTitle: {
    fontSize: fontScale(18),
    fontWeight: "600",
    color: Colors.primaryText,
    textAlign: "center",
    marginBottom: heightScale(8),
    marginTop: heightScale(16),
  },
  noMeetingsDescription: {
    fontSize: fontScale(14),
    color: Colors.secondaryText,
    textAlign: "center",
    lineHeight: fontScale(20),
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: heightScale(12),
  },
  avatar: {
    marginRight: widthScale(12),
  },
  avatarImage: {
    width: widthScale(48),
    height: widthScale(48),
    borderRadius: widthScale(24),
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: fontScale(18),
    fontWeight: "bold",
    color: Colors.primaryText,
    marginBottom: heightScale(4),
  },
  description: {
    fontSize: fontScale(14),
    color: Colors.secondaryText,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: widthScale(6),
  },
  ratingText: {
    fontSize: fontScale(12),
    color: Colors.orange,
    fontWeight: "500",
  },
  timeText: {
    fontSize: fontScale(12),
    color: Colors.blue,
    fontWeight: "500",
  },
  separator: {
    height: heightScale(8),
  },
});
