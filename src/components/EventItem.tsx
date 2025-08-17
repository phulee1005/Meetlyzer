import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { widthScale, heightScale, fontScale } from "utils/scale";
import { Colors } from "constants/colors";
import { useTranslation } from "react-i18next";
import { MeetingGoogleCalendar, PLATFORM } from "types/record";

interface EventItemProps {
  event: MeetingGoogleCalendar;
  onPress: (event: MeetingGoogleCalendar) => void;
}

export default function EventItem({ event, onPress }: EventItemProps) {
  const { t } = useTranslation();

  const getPlatformIcon = () => {
    switch (event.platform) {
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (startTime: string) => {
    // Default duration 1 hour if no endTime
    return "1h";
  };

  const isEventInProgress = () => {
    const now = new Date();
    const start = new Date(event.startTime);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // Add 1 hour
    return now >= start && now <= end;
  };

  const isEventUpcoming = () => {
    const now = new Date();
    const start = new Date(event.startTime);
    return now < start;
  };

  const getStatusColor = () => {
    if (isEventInProgress()) {
      return Colors.success;
    } else if (isEventUpcoming()) {
      return Colors.orange;
    } else {
      return Colors.secondaryText;
    }
  };

  const getStatusText = () => {
    if (isEventInProgress()) {
      return t("calendar.inProgress");
    } else if (isEventUpcoming()) {
      return t("calendar.upcoming");
    } else {
      return t("calendar.completed");
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(event)}>
      <View style={styles.timeSection}>
        <Text style={styles.timeText}>{formatTime(event.startTime)}</Text>
        <Text style={styles.durationText}>
          {formatDuration(event.startTime)}
        </Text>
      </View>

      <View style={styles.contentSection}>
        <View style={styles.header}>
          <View style={styles.platformIcon}>
            <Ionicons
              name={getPlatformIcon() as any}
              size={fontScale(16)}
              color={Colors.primaryButton}
            />
          </View>
          <Text style={styles.title} numberOfLines={2}>
            {event.summary || t("calendar.noTitle")}
          </Text>
        </View>

        {/* Description not available in current API response */}

        <View style={styles.footer}>
          <View style={styles.statusContainer}>
            <View
              style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
            />
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </View>

          {event.hangoutLink && (
            <TouchableOpacity style={styles.joinButton}>
              <Ionicons name="link" size={fontScale(14)} color={Colors.white} />
              <Text style={styles.joinButtonText}>{t("calendar.join")}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: widthScale(12),
    padding: widthScale(16),
    marginVertical: heightScale(4),
    flexDirection: "row",
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  timeSection: {
    alignItems: "center",
    marginRight: widthScale(12),
    minWidth: widthScale(50),
  },
  timeText: {
    fontSize: fontScale(14),
    fontWeight: "600",
    color: Colors.primaryText,
    marginBottom: heightScale(2),
  },
  durationText: {
    fontSize: fontScale(12),
    color: Colors.secondaryText,
  },
  contentSection: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: heightScale(8),
  },
  platformIcon: {
    marginRight: widthScale(8),
    marginTop: heightScale(2),
  },
  title: {
    fontSize: fontScale(16),
    fontWeight: "600",
    color: Colors.primaryText,
    flex: 1,
  },
  description: {
    fontSize: fontScale(14),
    color: Colors.secondaryText,
    marginBottom: heightScale(8),
    lineHeight: fontScale(18),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: widthScale(8),
    height: widthScale(8),
    borderRadius: widthScale(4),
    marginRight: widthScale(6),
  },
  statusText: {
    fontSize: fontScale(12),
    fontWeight: "500",
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryButton,
    paddingHorizontal: widthScale(12),
    paddingVertical: heightScale(6),
    borderRadius: widthScale(6),
  },
  joinButtonText: {
    fontSize: fontScale(12),
    fontWeight: "600",
    color: Colors.white,
    marginLeft: widthScale(4),
  },
});
