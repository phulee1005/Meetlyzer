import React from "react";
import {
  View,
  TextInput as RNTextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fontScale, widthScale, heightScale } from "utils/scale";
import { Colors } from "constants/colors";

interface CustomTextInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  editable?: boolean;
  style?: any;
  containerStyle?: any;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  onFocus,
  onBlur,
  autoCapitalize = "none",
  keyboardType = "default",
  editable = true,
  style,
  containerStyle,
}) => {
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {leftIcon && (
        <Ionicons
          name={leftIcon}
          size={fontScale(20)}
          color={Colors.icon}
          style={styles.leftIcon}
        />
      )}
      <RNTextInput
        style={[styles.input, style]}
        placeholder={placeholder}
        placeholderTextColor={Colors.placeholderText}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        onFocus={onFocus}
        onBlur={onBlur}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        editable={editable}
      />
      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
          <Ionicons name={rightIcon} size={fontScale(20)} color={Colors.icon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: widthScale(25),
    backgroundColor: Colors.white,
    marginBottom: heightScale(16),
    width: widthScale(320),
    height: heightScale(48),
    paddingHorizontal: widthScale(16),
  },
  input: {
    flex: 1,
    fontSize: fontScale(16),
    color: Colors.inputText,
  },
  leftIcon: {
    marginRight: widthScale(8),
  },
  rightIcon: {
    marginLeft: widthScale(8),
  },
});

export default CustomTextInput;
