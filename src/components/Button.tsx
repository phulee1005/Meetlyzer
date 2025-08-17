import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { fontScale, heightScale, widthScale } from "utils/scale";
import { Colors } from "constants/colors";

const ButtonLoading = ({
  onPress,
  title,
  isLoading = false,
  disabled = false,
}: {
  onPress: () => void;
  title: string;
  isLoading?: boolean;
  disabled?: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.button}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={Colors.primaryButtonText} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default ButtonLoading;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: heightScale(48),
    backgroundColor: Colors.primaryButton,
    borderRadius: widthScale(24),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: heightScale(18),
  },
  text: {
    color: Colors.primaryText,
    fontSize: fontScale(18),
    fontWeight: "bold",
  },
});
