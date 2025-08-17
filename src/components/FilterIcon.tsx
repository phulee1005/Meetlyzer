import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { widthScale, heightScale, fontScale } from "utils/scale";
import { Colors } from "constants/colors";
import { useTranslation } from "react-i18next";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterIconProps {
  options: FilterOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export default function FilterIcon({
  options,
  selectedValue,
  onValueChange,
}: FilterIconProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );
  const hasActiveFilter = selectedValue !== "all";

  const handleOptionPress = (value: string) => {
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.iconButton, hasActiveFilter && styles.activeIconButton]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Ionicons
          name="filter"
          size={widthScale(16)}
          color={hasActiveFilter ? Colors.white : Colors.primaryText}
        />
        {hasActiveFilter && <View style={styles.activeIndicator} />}
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.dropdownMenu}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  option.value === selectedValue && styles.selectedOption,
                ]}
                onPress={() => handleOptionPress(option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    option.value === selectedValue && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
                {option.value === selectedValue && (
                  <Ionicons name="checkmark" size={16} color={Colors.blue} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  iconButton: {
    width: widthScale(24),
    height: widthScale(24),
    borderRadius: widthScale(12),
    backgroundColor: Colors.lightGray,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeIconButton: {
    backgroundColor: Colors.blue,
    borderColor: Colors.blue,
  },
  activeIndicator: {
    position: "absolute",
    top: -widthScale(2),
    right: -widthScale(2),
    width: widthScale(8),
    height: widthScale(8),
    borderRadius: widthScale(4),
    backgroundColor: Colors.orange,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: heightScale(100),
    paddingRight: widthScale(20),
  },
  dropdownMenu: {
    backgroundColor: Colors.white,
    borderRadius: widthScale(12),
    paddingVertical: heightScale(8),
    minWidth: widthScale(160),
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: widthScale(16),
    paddingVertical: heightScale(12),
    minWidth: widthScale(160),
  },
  selectedOption: {
    backgroundColor: Colors.lightBlue,
  },
  optionText: {
    fontSize: fontScale(14),
    color: Colors.primaryText,
  },
  selectedOptionText: {
    color: Colors.blue,
    fontWeight: "600",
  },
});
