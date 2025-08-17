import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import { convertSecondsToTime } from "utils/time";

interface TranscriptItemProps {
  speaker: string;
  content: string;
  timestamp: string;
}

const TranscriptItem: React.FC<TranscriptItemProps> = ({
  speaker,
  content,
  timestamp,
}) => {
  return (
    <View style={[styles.container, styles.highlighted]}>
      <View style={styles.header}>
        <Text style={styles.speakerName}>{speaker}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primaryText,
  },
  highlighted: {
    backgroundColor: Colors.white,
    borderLeftColor: Colors.primaryButton,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  speakerName: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primaryText,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  content: {
    fontSize: 15,
    color: Colors.primaryText,
    lineHeight: 22,
  },
});

export default TranscriptItem;
