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

interface FilterDropdownProps {
  options: FilterOption[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

export default function FilterDropdown({
  options,
  selectedValue,
  onValueChange,
}: FilterDropdownProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  const handleOptionPress = (value: string) => {
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.selectedText}>{selectedOption?.label}</Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={Colors.primaryText}
        />
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
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderRadius: widthScale(12),
    paddingHorizontal: widthScale(16),
    paddingVertical: heightScale(12),
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  selectedText: {
    fontSize: fontScale(16),
    color: Colors.primaryText,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: heightScale(100),
  },
  dropdownMenu: {
    backgroundColor: Colors.white,
    borderRadius: widthScale(12),
    paddingVertical: heightScale(8),
    minWidth: widthScale(200),
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
    minWidth: widthScale(200),
  },
  selectedOption: {
    backgroundColor: Colors.lightBlue,
  },
  optionText: {
    fontSize: fontScale(16),
    color: Colors.primaryText,
  },
  selectedOptionText: {
    color: Colors.blue,
    fontWeight: "600",
  },
});
