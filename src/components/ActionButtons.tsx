import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { widthScale, heightScale, fontScale } from "utils/scale";
import { Colors } from "constants/colors";
import { ActionItem } from "screens/Home/useHomeScreen";

interface ActionButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  isLoading?: boolean;
}

function ActionButton({
  icon,
  label,
  onPress,
  isLoading = false,
}: ActionButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={isLoading}
    >
      <View style={styles.iconContainer}>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primaryText} />
        ) : (
          <Ionicons name={icon as any} size={24} color={Colors.primaryText} />
        )}
      </View>
      <Text style={[styles.label, isLoading && styles.disabledText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface ActionButtonsProps {
  actions: ActionItem[];
  loadingStates?: { [key: string]: boolean };
}

export default function ActionButtons({
  actions,
  loadingStates = {},
}: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <ActionButton
          key={action.id}
          icon={action.icon}
          label={action.label}
          onPress={action.onPress}
          isLoading={loadingStates[action.id] || false}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: widthScale(20),
    marginVertical: heightScale(20),
  },
  button: {
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: widthScale(60),
    height: widthScale(60),
    borderRadius: widthScale(30),
    backgroundColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: heightScale(8),
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: fontScale(12),
    color: Colors.primaryText,
    textAlign: "center",
  },
  disabledText: {
    opacity: 0.6,
  },
});
