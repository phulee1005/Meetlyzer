import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import { convertSecondsToTime } from "utils/time";

interface MessageItemProps {
  sender: string;
  content: string;
  timestamp: number;
}

const MessageItem: React.FC<MessageItemProps> = ({
  sender,
  content,
  timestamp,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.senderName}>{sender}</Text>
      <Text style={styles.messageContent}>{content}</Text>
      <Text style={styles.timestamp}>
        {convertSecondsToTime(timestamp / 1000)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  senderName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primaryText,
    marginBottom: 8,
  },
  messageContent: {
    fontSize: 15,
    color: Colors.primaryText,
    lineHeight: 22,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.secondaryText,
    alignSelf: "flex-start",
  },
});

export default MessageItem;
