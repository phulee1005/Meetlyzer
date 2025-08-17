import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { widthScale, heightScale, fontScale } from "utils/scale";
import { Colors } from "constants/colors";
import {
  RecordMeeting as DocumentItemType,
  TRANSLATE_STATUS,
  JOINING_STATUS,
} from "types/record";
import { useTranslation } from "react-i18next";

interface DocumentItemProps {
  item: DocumentItemType;
  onPress: (item: DocumentItemType) => void;
}

export default function DocumentItem({ item, onPress }: DocumentItemProps) {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTranslateStatusConfig = (status: TRANSLATE_STATUS) => {
    switch (status) {
      case TRANSLATE_STATUS.NEW:
        return {
          color: Colors.blue,
          backgroundColor: Colors.lightBlue,
          icon: "language-outline",
          text: t("documents.translateStatus.new"),
        };
      case TRANSLATE_STATUS.PROCESSING:
        return {
          color: Colors.orange,
          backgroundColor: "#FFF3E0",
          icon: "language-outline",
          text: t("documents.translateStatus.processing"),
        };
      case TRANSLATE_STATUS.DONE:
        return {
          color: Colors.success,
          backgroundColor: "#E8F5E8",
          icon: "language-outline",
          text: t("documents.translateStatus.done"),
        };
      case TRANSLATE_STATUS.FAILED:
        return {
          color: Colors.error,
          backgroundColor: "#FFEBEE",
          icon: "language-outline",
          text: t("documents.translateStatus.failed"),
        };
      default:
        return {
          color: Colors.secondaryText,
          backgroundColor: Colors.lightGray,
          icon: "language-outline",
          text: t("documents.translateStatus.unknown"),
        };
    }
  };

  const getJoiningStatusConfig = (status: JOINING_STATUS) => {
    switch (status) {
      case JOINING_STATUS.NEW:
        return {
          color: Colors.blue,
          backgroundColor: Colors.lightBlue,
          icon: "sync-outline",
          text: t("documents.joiningStatus.new"),
        };
      case JOINING_STATUS.IMPORT:
        return {
          color: Colors.orange,
          backgroundColor: "#FFF3E0",
          icon: "sync-outline",
          text: t("documents.joiningStatus.import"),
        };
      case JOINING_STATUS.PROCESSING:
        return {
          color: Colors.orange,
          backgroundColor: "#FFF3E0",
          icon: "sync-outline",
          text: t("documents.joiningStatus.processing"),
        };
      case JOINING_STATUS.WATING_FOR_ADMIT:
        return {
          color: Colors.orange,
          backgroundColor: "#FFF3E0",
          icon: "sync-outline",
          text: t("documents.joiningStatus.waiting"),
        };
      case JOINING_STATUS.DONE:
        return {
          color: Colors.success,
          backgroundColor: "#E8F5E8",
          icon: "sync-outline",
          text: t("documents.joiningStatus.done"),
        };
      case JOINING_STATUS.FAILED:
        return {
          color: Colors.error,
          backgroundColor: "#FFEBEE",
          icon: "sync-outline",
          text: t("documents.joiningStatus.failed"),
        };
      default:
        return {
          color: Colors.secondaryText,
          backgroundColor: Colors.lightGray,
          icon: "sync-outline",
          text: t("documents.joiningStatus.unknown"),
        };
    }
  };

  const translateConfig = getTranslateStatusConfig(item.translateStatus);
  const joiningConfig = getJoiningStatusConfig(item.joiningStatus);

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(item)}>
      <View style={styles.content}>
        <View style={styles.infoSection}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title || `${t("home.newRecord")}`}
            </Text>
          </View>

          {
            <Text style={styles.original} numberOfLines={1}>
              {(item.joiningStatus === JOINING_STATUS.IMPORT &&
                t("home.import")) ||
                item.organizer}
            </Text>
          }

          <Text style={styles.description} numberOfLines={2}>
            {item.summary}
          </Text>

          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: translateConfig.backgroundColor },
              ]}
            >
              <Ionicons
                name={translateConfig.icon as any}
                size={16}
                color={translateConfig.color}
              />
              <Text
                style={[styles.statusText, { color: translateConfig.color }]}
              >
                {translateConfig.text}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: joiningConfig.backgroundColor },
              ]}
            >
              <Ionicons
                name={joiningConfig.icon as any}
                size={16}
                color={joiningConfig.color}
              />
              <Text style={[styles.statusText, { color: joiningConfig.color }]}>
                {joiningConfig.text}
              </Text>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons name="time" size={14} color={Colors.secondaryText} />
              <Text style={styles.detailText}>
                {formatDate(item.createdAt)}
              </Text>
            </View>
            {item.meetingCode !== "-" && (
              <View style={styles.detailItem}>
                <Ionicons
                  name="alert-circle"
                  size={14}
                  color={Colors.secondaryText}
                />
                <Text style={styles.detailText}>{item.meetingCode}</Text>
              </View>
            )}
            {item.platform !== "undefined" && (
              <View style={styles.detailItem}>
                <Ionicons
                  name="pricetag"
                  size={14}
                  color={Colors.secondaryText}
                />
                <Text style={styles.detailText}>{item.platform}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: widthScale(16),
    marginHorizontal: widthScale(20),
    marginVertical: heightScale(6),
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: "row",
    padding: widthScale(16),
  },
  thumbnailSection: {
    position: "relative",
    marginRight: widthScale(12),
  },
  thumbnail: {
    width: widthScale(60),
    height: widthScale(60),
    borderRadius: widthScale(8),
  },
  thumbnailPlaceholder: {
    width: widthScale(60),
    height: widthScale(60),
    borderRadius: widthScale(8),
    backgroundColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
  },
  liveBadge: {
    position: "absolute",
    top: -widthScale(4),
    right: -widthScale(4),
    backgroundColor: Colors.orange,
    borderRadius: widthScale(8),
    padding: widthScale(2),
  },
  infoSection: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: heightScale(4),
  },
  title: {
    fontSize: fontScale(16),
    fontWeight: "600",
    color: Colors.primaryText,
    flex: 1,
    marginRight: widthScale(8),
  },
  favoriteButton: {
    padding: widthScale(4),
  },
  description: {
    fontSize: fontScale(14),
    color: Colors.primaryText,
    marginBottom: heightScale(8),
    lineHeight: fontScale(20),
  },
  original: {
    fontSize: fontScale(14),
    color: Colors.secondaryText,
    marginBottom: heightScale(8),
    lineHeight: fontScale(20),
  },
  statusRow: {
    flexDirection: "row",
    marginBottom: heightScale(8),
    gap: widthScale(8),
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: widthScale(8),
    paddingVertical: widthScale(4),
    borderRadius: widthScale(12),
    gap: widthScale(4),
  },
  statusText: {
    fontSize: fontScale(10),
    fontWeight: "600",
  },
  detailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: heightScale(8),
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: widthScale(16),
    marginBottom: heightScale(4),
  },
  detailText: {
    fontSize: fontScale(12),
    color: Colors.secondaryText,
    marginLeft: widthScale(4),
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  tag: {
    backgroundColor: Colors.lightBlue,
    borderRadius: widthScale(12),
    paddingHorizontal: widthScale(8),
    paddingVertical: widthScale(4),
    marginRight: widthScale(6),
    marginBottom: heightScale(4),
  },
  tagText: {
    fontSize: fontScale(10),
    color: Colors.blue,
    fontWeight: "500",
  },
  moreTags: {
    fontSize: fontScale(10),
    color: Colors.secondaryText,
    marginLeft: widthScale(4),
  },
});
